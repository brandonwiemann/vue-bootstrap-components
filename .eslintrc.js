module.exports = {
    root: true,
    env: {
        browser: true,
        es6: true
    },
    extends: [
        'plugin:vue/essential',
        '@vue/typescript'
    ],
    parserOptions: {
        ecmaVersion: 2018,
        sourceType: 'module',
        parser: '@typescript-eslint/parser',
        ecmaFeatures: {
            "jsx": true
        }
    },
    plugins: [
        '@typescript-eslint',
        'sort-imports-es6-autofix',
        'vue'
    ],
    rules: {
        '@typescript-eslint/indent': ['error', 4, { 'SwitchCase': 1 }],
        '@typescript-eslint/explicit-function-return-type': ['error', {
            'allowExpressions': true
        }],
        'brace-style': ['error', '1tbs'],
        'comma-dangle': ['error', 'only-multiline'],
        'object-curly-spacing': ['error', 'always'],
        'indent': 'off',
        'key-spacing': ['error'],
        'keyword-spacing': ['error', {
            'before': true,
            'after': true
        }],
        'lines-between-class-members': 'off',
        'no-console': 'warn',
        'no-var': 'error',
        'prefer-const': 'error',
        'quotes': 'off',
        'semi': ['error', 'always'],
        'sort-imports-es6-autofix/sort-imports-es6': [2, {
            'ignoreCase': true,
            'memberSyntaxSortOrder': ['none', 'all', 'single', 'multiple']
        }],
        'space-before-blocks': ['error', 'always'],
        'space-infix-ops': 'error',
        'space-unary-ops': ['error', {
            'words': true,
            'nonwords': false
        }],
        'vue/component-name-in-template-casing': ['error', 'kebab-case'],
        'vue/custom-event-name-casing': 'off',
        'vue/html-indent': ['warn', 4, {
            'attribute': 1,
            'baseIndent': 1,
            'closeBracket': 0,
            'alignAttributesVertically': true,
            'ignores': []
        }],
        'vue/html-self-closing': ['warn', {
            'html': {
                'normal': 'never',
                'void': 'always'
            }
        }],
        'vue/max-attributes-per-line': ['error', {
            'singleline': 4,
            'multiline': {
                'max': 1,
                'allowFirstLine': false
            }
        }],
        'vue/require-default-prop': 'off',
        'vue/singleline-html-element-content-newline': 'off',
        'vue/html-closing-bracket-spacing': ['error', {
            'startTag': 'never',
            'endTag': 'never',
            'selfClosingTag': 'always',
        }],
        'vue/html-closing-bracket-newline': ['error', {
            'singleline': 'never',
            'multiline': 'always',
        }]
    },
    overrides: [
        {
            'files': [
                '**/*.vue',
                '**/*.js'
            ],
            'rules': {
                '@typescript-eslint/explicit-function-return-type': 'off',
            }
        }
    ]
};

