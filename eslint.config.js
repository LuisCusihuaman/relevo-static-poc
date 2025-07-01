/**
 * @type {import('eslint').Linter.Config[]}
 */
import globals from "globals";
import pluginJs from "@eslint/js";
import tseslint from "typescript-eslint";
import pluginReact from "eslint-plugin-react";
import pluginReactHooks from "eslint-plugin-react-hooks";
import pluginJsxA11y from "eslint-plugin-jsx-a11y";
import prettierConfig from "eslint-config-prettier";

export default [
  // 1. Archivos y carpetas a ignorar globalmente
  {
    ignores: [
      "dist/**",
      "node_modules/**",
      ".DS_Store",
      "*.lock",
      "vite.config.ts.timestamp-*.mjs",
      "coverage/**",
      "*.html",
    ],
  },

  // 2. Configuraciones base para JS y TypeScript
  pluginJs.configs.recommended,
  ...tseslint.configs.recommended,

  // 3. Configuración específica para React
  {
    files: ["src/**/*.{ts,tsx}"],
    plugins: {
      react: pluginReact,
      "react-hooks": pluginReactHooks,
      "jsx-a11y": pluginJsxA11y,
    },
    languageOptions: {
      parserOptions: {
        ecmaFeatures: {
          jsx: true,
        },
        // ¡MUY IMPORTANTE! Asegúrate que esta ruta a tu tsconfig sea correcta.
        // Es crucial para que las reglas de TypeScript funcionen bien.
        project: "./tsconfig.app.json",
      },
      globals: {
        ...globals.browser,
        ...globals.node, // Agregado para soportar entornos de Node si es necesario
      },
    },
    rules: {
      // Aplicar reglas recomendadas de los plugins
      ...pluginReact.configs.recommended.rules,
      ...pluginReact.configs["jsx-runtime"].rules, // Reglas para el nuevo JSX Transform
      ...pluginReactHooks.configs.recommended.rules,
      ...pluginJsxA11y.configs.recommended.rules,

      // --- AJUSTES Y REGLAS PERSONALIZADAS ---

      // Errores que se convierten en advertencias (warnings)
      "@typescript-eslint/no-explicit-any": "warn", // Es mejor no usar 'any', pero lo ponemos como warning para no bloquear
      "@typescript-eslint/no-unused-vars": [
        "warn",
        { argsIgnorePattern: "^_", varsIgnorePattern: "^_" },
      ],

      // Reglas para mejorar la calidad del código
      "no-case-declarations": "error", // Forzar a usar llaves en los 'case'
      "@typescript-eslint/no-require-imports": "error", // Prohibir `require` en favor de `import`

      // Desactivar reglas que no son necesarias con TypeScript o Vite
      "react/prop-types": "off",
      "react/react-in-jsx-scope": "off",
    },
    settings: {
      react: {
        version: "detect", // Detectar automáticamente la versión de React
      },
    },
  },

  // 4. Configuración de Prettier. SIEMPRE debe ser la última.
  // Desactiva las reglas de ESLint que entran en conflicto con Prettier.
  prettierConfig,
];
