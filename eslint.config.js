import js from '@eslint/js';
import astroPlugin from 'eslint-plugin-astro';
import jsxA11yPlugin from 'eslint-plugin-jsx-a11y';
import reactPlugin from 'eslint-plugin-react';
import reactHooksPlugin from 'eslint-plugin-react-hooks';
import tsPlugin from '@typescript-eslint/eslint-plugin';
import tsParser from '@typescript-eslint/parser';
import globals from 'globals';

const reactFlat = reactPlugin.configs?.flat ?? {};
const reactRecommended = reactFlat.recommended ?? reactPlugin.configs?.recommended ?? {};
const reactJsxRuntime = reactFlat['jsx-runtime'] ?? reactPlugin.configs?.['jsx-runtime'] ?? {};
const tsFlatRecommended = tsPlugin.configs?.['flat/recommended'] ?? [];

export default [
  {
    ignores: ['dist', '.astro', 'node_modules']
  },
  js.configs.recommended,
  ...astroPlugin.configs['flat/recommended'],
  ...astroPlugin.configs['flat/jsx-a11y-recommended'],
  {
    files: ['src/**/*.{js,jsx}'],
    languageOptions: {
      globals: {
        ...globals.browser
      }
    }
  },
  ...tsFlatRecommended.map((config, index) => ({
    ...config,
    files: config.files ?? ['**/*.{ts,tsx,cts,mts}'],
    languageOptions: {
      ...config.languageOptions,
      parser: tsParser,
      parserOptions: {
        ...(config.languageOptions?.parserOptions ?? {}),
        ecmaFeatures: {
          ...(config.languageOptions?.parserOptions?.ecmaFeatures ?? {}),
          jsx: true
        }
      },
      globals: {
        ...globals.browser,
        ...(config.languageOptions?.globals ?? {})
      }
    },
    rules: {
      ...(config.rules ?? {}),
      ...(index === tsFlatRecommended.length - 1
        ? { '@typescript-eslint/no-unused-vars': ['warn', { argsIgnorePattern: '^_' }] }
        : {})
    }
  })),
  {
    files: ['src/**/*.{tsx,jsx}'],
    languageOptions: {
      parser: tsParser,
      parserOptions: {
        ecmaVersion: 'latest',
        sourceType: 'module',
        ecmaFeatures: {
          jsx: true
        }
      },
      globals: {
        ...globals.browser
      }
    },
    plugins: {
      react: reactPlugin,
      'react-hooks': reactHooksPlugin,
      'jsx-a11y': jsxA11yPlugin
    },
    settings: {
      react: {
        version: 'detect'
      }
    },
    rules: {
      ...(reactRecommended.rules ?? {}),
      ...(reactJsxRuntime.rules ?? {}),
      ...(reactHooksPlugin.configs?.recommended?.rules ?? {}),
      ...(jsxA11yPlugin.configs?.recommended?.rules ?? {}),
      'react/prop-types': 'off'
    }
  },
  {
    files: [
      '**/*.config.{js,ts,mjs,cjs}',
      'astro.config.mjs',
      'postcss.config.mjs',
      'tailwind.config.mjs',
      'vitest.config.ts'
    ],
    languageOptions: {
      globals: {
        ...globals.node
      }
    }
  },
  {
    files: ['src/**/*.test.{ts,tsx}'],
    languageOptions: {
      globals: {
        ...globals.node,
        ...globals.vitest
      }
    }
  }
];
