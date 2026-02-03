/**
 * @file Dae grammar for tree-sitter
 * @author Himalian
 * @license BSD
 */

/// <reference types="tree-sitter-cli/dsl" />
// @ts-check

export default grammar({
  name: "dae",

  extras: $ => [
    /\s/,
    $.comment
  ],
  rules: {
    // TODO: add the actual grammar rules
    source_file: $ => repeat($.block),
    block: $ => seq(
      field(
        "name", $.identifier,
      ),
      "{",
      repeat(choice(
        $.key_value,
        $.function_call
      )),
      "}"
    ),
    identifier: $ => /[a-zA-Z_]+/,
    comment: $ => token(seq("#", /.*/)),
    key_value: $ => seq(
      field("key", $.identifier), ":", field("value", $.identifier)
    ),

    // function call: print("hello")
    function_call: $ => seq(
      field("function_name", $.identifier), "(",
      field("argument", $.identifier)
      , ")"
    ),

  }
});
