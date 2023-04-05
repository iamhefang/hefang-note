module.exports = {
  // https://github.com/typescript-eslint/typescript-eslint/tree/main/packages/parser#configuration
  parser: "@typescript-eslint/parser",
  parserOptions: {
    ecmaFeatures: {
      jsx: true,
    },
    ecmaVersion: "latest",
    project: "./tsconfig.eslint.json",
    sourceType: "module",
  },

  plugins: ["@typescript-eslint", "import", "react", "react-hooks"],
  extends: ["plugin:import/typescript"],
  settings: {
    react: {
      version: "detect",
    },
  },
  rules: {
    ////// ESLint: https://eslint.org/docs/rules/

    //// Possible Problems

    "constructor-super": "error",
    "no-cond-assign": ["error", "always"],
    "no-control-regex": "error",
    "no-constant-condition": "error",
    "no-debugger": "error",
    "no-duplicate-case": "error",
    "no-duplicate-imports": "error",
    "no-invalid-regexp": "error",
    "no-sparse-arrays": "error",
    "no-template-curly-in-string": "error",
    "no-unsafe-finally": "error",
    "use-isnan": "error",

    //// Suggestions

    curly: "error",
    "default-case": "error",
    "dot-notation": "error",
    eqeqeq: "error",
    "guard-for-in": "error",
    "max-classes-per-file": ["error", 3],
    "max-statements": ["error", 100],
    "no-bitwise": "error",
    "no-caller": "error",
    "no-console": ["error", { allow: ["error", "warn", "info"] }],
    "no-empty": "error",
    "no-eval": "error",
    "no-extra-bind": "error",
    "no-extra-semi": "error",
    "no-implied-eval": "error",
    "no-labels": "error",
    "no-new-func": "error",
    "no-new-wrappers": "error",
    "no-octal": "error",
    "no-octal-escape": "error",
    "no-param-reassign": "error",
    // "no-plusplus": "error",
    "no-redeclare": "error",
    "no-regex-spaces": "error",
    "no-restricted-imports": [
      "error",
      {
        paths: [".", "./", "..", "../"],
      },
    ],
    // "no-restricted-syntax": [
    //   "error",
    //   "ForInStatement",
    //   {
    //     selector: "MemberExpression[object.name='document'][property.name='cookie']",
    //     message: "Do not use document.cookie",
    //   },
    //   {
    //     selector: "MemberExpression[object.name='document'][property.name='write']",
    //     message: "Do not use document.write",
    //   },
    //   {
    //     selector: "ForStatement[init=null][update=null]",
    //     message: 'Replace this "for" loop with a "while" loop.',
    //   },
    //   {
    //     selector: "ExportDefaultDeclaration",
    //     message: "Prefer named exports",
    //   },
    //   {
    //     selector: "ExportSpecifier[exported.name='default']",
    //     message: "Prefer named exports",
    //   },
    // ],
    "no-return-await": "error",
    "no-sequences": "error",
    "no-undef-init": "error",
    "no-var": "error",
    "no-warning-comments": "warn",
    "no-with": "error",
    "one-var": ["error", "never"],
    "prefer-const": "error",
    "prefer-object-spread": "error",
    "prefer-template": "error",
    "sort-imports": ["warn", { ignoreCase: true, ignoreDeclarationSort: true }],
    radix: "error",
    yoda: "error",

    //// Layout & Formatting

    "comma-dangle": ["error", "always-multiline"],
    // indent: ["error", 2, { SwitchCase: 1 }],
    "linebreak-style": ["error", "unix"],
    "max-len": ["error", { code: 160, ignoreStrings: true }],
    "new-parens": "error",
    "padding-line-between-statements": ["error", { blankLine: "always", prev: "*", next: "return" }],
    quotes: ["error", "double", { avoidEscape: true }],
    semi: ["error", "never"],

    //// Supported Rules

    "@typescript-eslint/adjacent-overload-signatures": "error",
    "@typescript-eslint/array-type": ["error", { default: "array", readonly: "generic" }],
    "@typescript-eslint/await-thenable": "error",
    "@typescript-eslint/ban-types": "error",
    "@typescript-eslint/consistent-type-assertions": ["error", { assertionStyle: "as", objectLiteralTypeAssertions: "never" }],
    "@typescript-eslint/member-ordering": [
      "error",
      {
        default: [
          "public-static-field",
          "protected-static-field",
          "private-static-field",

          "public-instance-field",
          "protected-instance-field",
          "private-instance-field",

          "constructor",

          "public-static-method",
          "protected-static-method",
          "private-static-method",

          "public-instance-method",
          "protected-instance-method",
          "private-instance-method",
        ],
      },
    ],
    "@typescript-eslint/naming-convention": [
      "error",
      {
        selector: "typeLike",
        format: ["PascalCase"],
      },
      {
        selector: "enum",
        format: ["PascalCase", "UPPER_CASE"],
      },
      {
        selector: "interface",
        prefix: ["I"],
        format: ["PascalCase"],
      },
    ],
    "@typescript-eslint/no-empty-interface": ["error", { allowSingleExtends: true }],
    "@typescript-eslint/no-explicit-any": "error",
    "@typescript-eslint/no-extraneous-class": "error",
    "@typescript-eslint/no-floating-promises": ["error", { ignoreVoid: true }],
    "@typescript-eslint/no-for-in-array": "error",
    "@typescript-eslint/no-misused-new": "error",
    // "@typescript-eslint/no-non-null-assertion": "error",
    "@typescript-eslint/no-parameter-properties": "error",
    "@typescript-eslint/no-require-imports": "error",
    "@typescript-eslint/no-this-alias": "error",
    "@typescript-eslint/no-unnecessary-qualifier": "error",
    "@typescript-eslint/no-unnecessary-type-arguments": "error",
    "@typescript-eslint/no-unnecessary-type-assertion": "error",
    "@typescript-eslint/no-var-requires": "error",
    "@typescript-eslint/prefer-for-of": "error",
    "@typescript-eslint/prefer-function-type": "error",
    "@typescript-eslint/prefer-readonly": "error",
    "@typescript-eslint/promise-function-async": "error",
    "@typescript-eslint/restrict-plus-operands": "error",
    "@typescript-eslint/triple-slash-reference": ["error", { types: "prefer-import" }],
    "@typescript-eslint/unified-signatures": "error",

    //// Extension Rules

    "@typescript-eslint/no-array-constructor": "error",
    "@typescript-eslint/no-shadow": "error",
    "@typescript-eslint/no-throw-literal": "error",
    "@typescript-eslint/no-unused-expressions": [
      "error",
      {
        allowTernary: true,
        allowShortCircuit: true,
        allowTaggedTemplates: true,
      },
    ],
    "@typescript-eslint/no-use-before-define": "error",
    "@typescript-eslint/no-useless-constructor": "error",

    ////// react: https://github.com/yannickcr/eslint-plugin-react#list-of-supported-rules

    //// General

    "react/no-danger": "error",
    "react/no-string-refs": "error",
    "react/no-unused-state": "error",
    "react/self-closing-comp": "error",

    //// JSX-specific rules

    // "react/jsx-boolean-value": ["error", "always"],
    "react/jsx-closing-bracket-location": ["error", "line-aligned"],
    "react/jsx-key": "error",
    "react/jsx-no-bind": [
      "error",
      {
        ignoreDOMComponents: true,
        ignoreRefs: true,
        allowArrowFunctions: false,
        allowFunctions: false,
        allowBind: false,
      },
    ],
    "react/jsx-no-target-blank": ["error", {}],

    ////// react-hooks: https://reactjs.org/docs/hooks-rules.html

    "react-hooks/exhaustive-deps": "error",
    "react-hooks/rules-of-hooks": "error",

    ////// import: https://github.com/import-js/eslint-plugin-import#rules

    //// Static analysis

    "import/no-internal-modules": [
      "warn",
      {
        allow: ["react-dom/client", "@tauri-apps/api/**", "**/assets/*", "antd/locale/*", "refractor/lang/*", "**/*.css"],
      },
    ],
    "import/no-useless-path-segments": [
      "error",
      {
        noUselessIndex: true,
      },
    ],
    "import/no-relative-parent-imports": "error",

    //// Style guide

    "import/order": [
      "warn",
      {
        alphabetize: {
          order: "asc",
          caseInsensitive: true,
        },
        groups: ["builtin", "external", "internal", "parent", "sibling", "index"],
        "newlines-between": "always",
        pathGroups: [
          {
            pattern: "~/**",
            group: "internal",
          },
        ],
      },
    ],
  },
}
