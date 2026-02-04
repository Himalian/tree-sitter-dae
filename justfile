parse file_name='example.dae':
    tree-sitter parse {{ file_name }}

generate:
    tree-sitter generate

test:
    tree-sitter test
