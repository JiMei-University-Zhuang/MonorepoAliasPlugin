const path = require('path');

class MonorepoAliasPlugin {
  constructor(options = {}) {
    this.options = {
      packages: [],
      rootDir: process.cwd(),
      ...options
    };
  }

  apply(compiler) {
    compiler.hooks.normalModuleFactory.tap('MonorepoAliasPlugin', (normalModuleFactory) => {
      normalModuleFactory.hooks.beforeResolve.tap('MonorepoAliasPlugin', (resolveData) => {
        if (!resolveData) return;
        return resolveData;
      });
    });
  }
}

module.exports = MonorepoAliasPlugin; 