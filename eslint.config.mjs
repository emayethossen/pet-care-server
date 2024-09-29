// @ts-check

import eslint from '@eslint/js';
import globals from 'globals';
import tseslint from 'typescript-eslint';

export default tseslint.config(
    {
        ignores: ["**/node_modules/", ".dist/"],
        languageOptions: {
          globals: {
            ...globals.browser,
            process: "readonly",
          },
        },
    
        rules: {
          "no-unused-vars": "error",
          "no-unused-expressions": "error",
          "prefer-const": "error",
          "no-console": "warn",
          "no-undef": "error",
        },
        
      },
      {
        ignores:["**/.env","**/dist/","**/node_modules/"]
      },
  eslint.configs.recommended,
  ...tseslint.configs.recommended,
  
);