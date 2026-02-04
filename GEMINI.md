# Tree-sitter Dae

This project is a [Tree-sitter](https://tree-sitter.github.io/tree-sitter/) grammar for the **Dae** language.

## Project Overview

*   **Type:** Tree-sitter Grammar
*   **Language:** JavaScript (Grammar Definition), C (Generated Parser)
*   **Goal:** Parse `.dae` files using Tree-sitter.
*   **Status:** Early development. The grammar currently defines a basic block structure with comments.

## Getting Started

### Prerequisites

*   **Node.js:** Required for the build tools and bindings.
*   **Tree-sitter CLI:** Installed locally via npm.
*   **C Compiler:** (gcc/clang) Required to build the generated parser.

### Installation

Install the project dependencies:

```bash
# use mise(recommend)
mise exec nodejs@22 -- npm install
# or use npm
npm install
# bun is faster, but it may too new to support tree-sitter
bun install
```

### Building the Parser

After modifying `grammar.js`, you must regenerate the C parser:

```bash
tree-sitter generate
```

To build the WASM parser for the web playground:

```bash
tree-sitter build --wasm
```
### parse specific file
```bash
tree-sitter parse example.dae
### Running Tests

Run the Tree-sitter corpus tests:

```bash
npm test
# OR directly via CLI
tree-sitter test
```

### Interactive Playground

Launch the local web-based playground to visualize the syntax tree:

```bash
npm start
```

## Project Structure

*   **`grammar.js`**: The core grammar definition file. This is where you define the syntax rules.
*   **`src/`**: Contains the generated C parser (`parser.c`) and other C resources.
*   **`bindings/`**: Contains language bindings (Node.js, C).
*   **`queries/`**: Contains tree-sitter queries (highlights, tags, etc.) - *currently empty or non-existent*.
*   **`test/corpus/`**: Contains text-based test cases for the grammar.
*   **`example.dae`**: A sample file demonstrating the language syntax.
*   **`tree-sitter.json`**: Configuration file for the Tree-sitter CLI.

## Development Workflow

1.  **Edit Grammar:** Modify `grammar.js` to add or change rules.
2.  **Generate:** Run `npx tree-sitter generate` to update the C parser.
3.  **Test:** Run `npx tree-sitter test` to verify changes against the corpus.
4.  **Visualize:** Use `npm start` to see the parse tree in real-time.
