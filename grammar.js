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
		// TODO: add the actual grammar rules

		// source_file is composed of blocks
		source_file: ($) => repeat($.block),
		// block
		// global {
		// something...
		// }
		block: ($) =>
			seq(
				field("name", $.identifier),
				"{",
				repeat(choice($.key_value, $.function_call, $.rules)),
				"}",
			),
		// key_value: log_level: info
		key_value: ($) =>
			seq(field("key", $.identifier), ":", field("value", $._value)),

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
			choice(
				$.identifier,
				$.numbers,
				$.string,
				$.boolean,
				$.url,
				$.ip_address,
				$.unix_path,
			),

		// basic tokens

		identifier: (_) => /[a-zA-Z_]+/,
		// comment: # This is a comment
		comment: (_) => token(seq("#", /.*/)),

		numbers: (_) => /\d+/,
		// string: "string" or 'string'
		string: (_) => seq('"', repeat(choice(/[^"]/, /\\./)), '"'),
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

		// url: https://example.com, vmess://example.com, trojan://example.com:25565, file:///home/butter/example.dae
		url: ($) =>
			seq(
				field("scheme", $.identifier),
				"://",
				field("host", /[a-zA-Z0-9._/-]+/),
				optional(seq(":", field("port", $.numbers))),
			),

		// ip_address: 1.1.1.1
		ip_address: ($) =>
			seq($.numbers, ".", $.numbers, ".", $.numbers, ".", $.numbers),

		// port: 25565
		port: ($) => $.numbers,

		// rules: domain(suffix: google.com, keyword: youtube) -> proxy
		// rules can be composed via logic operators,
		// example: domain(suffix: google.com, keyword: youtube) &&
		// domain(suffix: apple.com, keyword: itunes) -> proxy
		logic_operator: (_) => choice("&&", "||"),
		rules: ($) => seq($.expression, "->", field("destination", $.identifier)),
		expression: ($) => seq($.function_call, repeat(seq($.logic_operator, $.function_call))),
	},
});
