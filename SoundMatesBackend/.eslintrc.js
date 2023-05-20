module.exports = {
  "env": {
    "browser": true,
    "node": true,
    "jest/globals": true,
    "es2021": true
  },
  "extends": ["eslint:recommended", "plugin:jest/recommended"],
  "parserOptions": {
    "ecmaVersion": "latest",
    "sourceType": "module"
  },
  "ignorePatterns": ["cypress.config.js"],
  "plugins": ["jest"],
  "rules": {
    "jest/expect-expect": "error"
  }
}
