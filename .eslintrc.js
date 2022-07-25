const typescriptExtends = [
  'eslint:recommended',
  'plugin:@typescript-eslint/eslint-recommended',
  'plugin:@typescript-eslint/recommended',
  'prettier'
];

const config = {};
const overrides = [];

overrides.push({
  extends: typescriptExtends,
  files: ['./**/*.ts']
});

config.env = {
  es6: true,
  node: true
};
config.extends = ['eslint:recommended', 'prettier'];
config.overrides = overrides;
config.parserOptions = {
  ecmaVersion: 'latest',
  sourceType: 'module'
};
config.root = true;

module.exports = config;
