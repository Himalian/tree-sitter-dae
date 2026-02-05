/**
 * @file Dae grammar for tree-sitter
 * @author Himalian
 * @license BSD
 */

/// <reference types="tree-sitter-cli/dsl" />
// @ts-check

export default grammar({
	name: "dae",

	extras: ($) => [/\s/, $.comment],
	rules: {
		// source_file is composed of blocks
		source_file: ($) =>
			// choice(optional($.global), optional($.routing), repeat($.block)),
			repeat($.block),
		// The `global` configuration block
		global: ($) =>
			seq(
				"global",
				"{",
				repeat(
					choice($.key_value, $.function_call, $.rules, $.block, $.string),
				),
				"}",
			),
		// routing {
		// something...
		// }
		routing: ($) =>
			seq(
				"routing",
				"{",
				repeat(
					choice($.key_value, $.function_call, $.rules, $.block, $.string),
				),
				"}",
			),
		// block {
		// something...
		// }
		block: ($) =>
			seq(
				field("name", $.identifier),
				"{",
				repeat(
					choice($.key_value, $.function_call, $.rules, $.block, $.string),
				),
				"}",
			),
		// key_value: log_level: info
		key_value: ($) =>
			prec(
				1,
				seq(
					field("key", $.identifier),
					":",
					field("value", choice($._value, $.rules, $.expression)),
				),
			),

		// function call: function_name(argument_a, argument_b, ...)
		function_call: ($) =>
			seq(
				field("function_name", $.identifier),
				"(",
				optional(
					seq(
						field("argument", $._argument),
						repeat(seq(",", field("argument", $._argument))),
					),
				),
				")",
			),

		_argument: ($) => choice($._value, $.function_call, $.key_value),

		_value: ($) =>
			// complex tokens should be tried first
			choice(
				$.cidr,
				$.ip_address,
				// url should have higher priority
				prec(2, $.url),
				$.unix_path,

				$.identifier,
				$.numbers,
				$.time,
				$.string,
				$.boolean,
			),

		// basic tokens

		identifier: (_) => /[a-zA-Z_][a-zA-Z0-9_@-]*/,
		// comment: # This is a comment
		comment: (_) => token(seq("#", /.*/)),

		numbers: (_) => /\d+/,

		// 25s, 15ms, 7d
		time: (_) =>
			token(seq(/\d+/, choice("ms", "s", "min", "h", "d", "m", "w"))),
		// string: "string" or 'string'
		string: (_) =>
			choice(
				seq('"', repeat(choice(/[^"]/, /\\./)), '"'),
				seq("'", repeat(choice(/[^']/, /\\./)), "'"),
			),
		boolean: (_) => choice("true", "false"),

		// dae specific tokens

		// unix_path: /usr/bin/sh, ~/example.md, ./example.dae, example.dae
		unix_path: (_) =>
			token(
				choice(
					seq(choice("/", "./", "../", "~/"), /[a-zA-Z0-9._/-]*/),
					/[a-zA-Z0-9._-]+\.[a-zA-Z0-9._-]+/,
				),
			),

		// url: https://example.com, vmess://example.com, trojan://example.com:25565,
		// file:///home/butter/example.dae, tcp+udp://dns.example.com:53
		url: (_) =>
			token(
				seq(
					/[a-zA-Z][a-zA-Z0-9+.-]*/,
					"://",
					/[a-zA-Z0-9._/-]+/,
					optional(seq(":", /\d+/)),
				),
			),

		// cidr: 224.0.0.0/3
		cidr: ($) => seq($.ip_address, "/", $.numbers),

		// ip_address: 1.1.1.1
		ip_address: (_) => token(prec(2, /\d+\.\d+\.\d+\.\d+/)),

		// port: 25565
		port: ($) => $.numbers,

		// rules:
		// domain(suffix: google.com, keyword: youtube) -> proxy
		// rules can be composed via logic operators,
		// example: domain(suffix: google.com, keyword: youtube) &&
		// !domain(suffix: apple.com, keyword: itunes) -> proxy
		logic_operator: (_) => choice("&&", "||"),
		rules: ($) => seq($.expression, "->", field("destination", $.identifier)),
		expression: ($) =>
			seq(
				optional("!"),
				$.function_call,
				repeat(seq($.logic_operator, optional("!"), $.function_call)),
			),
	},
});
