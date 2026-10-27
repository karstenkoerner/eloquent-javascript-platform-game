import js from '@eslint/js';
import globals from 'globals';
import { defineConfig } from 'eslint/config';

export default defineConfig([
	{
		files: ['**/*.{js,mjs,cjs}'],
		plugins: {
			js,
		},
		extends: ['js/recommended'],
		languageOptions: {
			globals: globals.browser,
		},
		rules: {
			'no-unused-vars': 'warn',
			'prefer-const': 'warn',
			eqeqeq: 'error',
		},
	},
	{
		files: ['tests/**/*.{js,mjs,cjs}'],
		languageOptions: {
			globals: globals.node,
		},
	},
]);
