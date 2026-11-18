import { readdirSync } from 'node:fs';

import vitest from '@vitest/eslint-plugin';
import prettier from 'eslint-config-prettier/flat';
import checkFile from 'eslint-plugin-check-file';
import jestDom from 'eslint-plugin-jest-dom';
import testingLibrary from 'eslint-plugin-testing-library';
import { defineConfig, globalIgnores } from 'eslint/config';
import nextVitals from 'eslint-config-next/core-web-vitals';
import nextTs from 'eslint-config-next/typescript';

/** Every folder in src/features, so a new feature is covered by the import boundaries without editing this file. */
const features = readdirSync(new URL('./src/features/', import.meta.url), { withFileTypes: true })
  .filter((entry) => entry.isDirectory())
  .map((entry) => entry.name);

export default defineConfig([
  ...nextVitals,
  ...nextTs,
  globalIgnores([
    '.next/**',
    'test-results/**',
    'playwright-report/**',
    'out/**',
    'build/**',
    'next-env.d.ts',
    'design-reference/**',
    '.compare/**',
    'coverage/**',
  ]),
  {
    files: ['src/**/*.{ts,tsx}'],
    rules: {
      // Bulletproof React: features never import each other, and code flows one way:
      // shared (components, config, lib, utils) -> features -> app.
      'import/no-restricted-paths': [
        'error',
        {
          zones: [
            ...features.map((f) => ({
              target: `./src/features/${f}`,
              from: './src/features',
              except: [`./${f}`],
              message: 'Features must not import from other features; move shared code to src/components or src/lib.',
            })),
            { target: './src/features', from: './src/app', message: 'Features must not import from app routes.' },
            {
              target: ['./src/components', './src/config', './src/lib', './src/utils', './src/hooks', './src/types'],
              from: ['./src/features', './src/app'],
              message: 'Shared code must not import from features or app routes.',
            },
          ],
        },
      ],
      'import/order': [
        'error',
        {
          groups: ['builtin', 'external', 'internal', 'parent', 'sibling', 'index', 'object'],
          pathGroups: [{ pattern: '@/**', group: 'internal' }],
          'newlines-between': 'always',
          alphabetize: { order: 'asc', caseInsensitive: true },
        },
      ],
      'import/no-cycle': 'error',
      '@typescript-eslint/no-unused-vars': ['error', { argsIgnorePattern: '^_', varsIgnorePattern: '^_' }],
      'react/jsx-no-target-blank': 'error',
      'no-console': ['error', { allow: ['warn', 'error'] }],
    },
  },
  {
    files: ['src/**/*.{ts,tsx}'],
    ignores: ['src/app/**'],
    plugins: { 'check-file': checkFile },
    rules: {
      'check-file/filename-naming-convention': ['error', { '**/*.{ts,tsx}': 'KEBAB_CASE' }, { ignoreMiddleExtensions: true }],
    },
  },
  {
    files: ['src/**/*'],
    plugins: { 'check-file': checkFile },
    rules: {
      'check-file/folder-naming-convention': [
        'error',
        { 'src/{components,config,features,lib,utils,hooks,testing,assets,types}/**/!(__tests__)/': 'KEBAB_CASE' },
      ],
    },
  },
  {
    files: ['src/**/*.test.{ts,tsx}'],
    plugins: { vitest, 'testing-library': testingLibrary, 'jest-dom': jestDom },
    languageOptions: { globals: vitest.environments.env.globals },
    rules: {
      ...vitest.configs.recommended.rules,
      ...testingLibrary.configs['flat/react'].rules,
      ...jestDom.configs['flat/recommended'].rules,
    },
  },
  prettier,
]);
