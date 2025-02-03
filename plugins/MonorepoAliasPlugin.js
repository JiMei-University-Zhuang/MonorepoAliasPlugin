const path = require('path');

class MonorepoAliasPlugin {
  constructor(options = {}) {
    this.options = {
      packages: [], // monorepo 中的包列表
      rootDir: process.cwd(), // 项目根目录
      ...options
    };
  }

  apply(compiler) {
    
  }
}

module.exports = MonorepoAliasPlugin; 