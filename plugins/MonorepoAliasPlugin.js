const path = require('path');

class MonorepoAliasPlugin {
  constructor(options = {}) {
    this.options = {
      packages: [], // monorepo 中的包列表
      rootDir: process.cwd(), // 项目根目录
      ...options
    };
    
    // 预处理包配置
    this.aliasMap = this._generateAliasMap();
  }

  _generateAliasMap() {
    const aliasMap = new Map();
    
    this.options.packages.forEach(pkg => {
      // 支持简单字符串格式和对象格式
      const pkgName = typeof pkg === 'string' ? pkg : pkg.name;
      const pkgPath = typeof pkg === 'string' ? 
        path.join(this.options.rootDir, 'packages', pkg) :
        path.join(this.options.rootDir, pkg.path);
      
      aliasMap.set(pkgName, pkgPath);
    });
    
    return aliasMap;
  }

  apply(compiler) {
    // 注册 resolve 钩子
    compiler.hooks.normalModuleFactory.tap('MonorepoAliasPlugin', (normalModuleFactory) => {
      normalModuleFactory.hooks.beforeResolve.tap('MonorepoAliasPlugin', (resolveData) => {
        if (!resolveData) return;
        
        const { request, context } = resolveData;
        
        // 检查是否匹配任何包名
        for (const [pkgName, pkgPath] of this.aliasMap) {
          if (request.startsWith(pkgName + '/')) {
            // 替换包名为实际路径
            resolveData.request = path.join(
              pkgPath,
              request.slice(pkgName.length + 1) // +1 是为了去掉斜杠
            );
            break;
          }
        }
        
        return resolveData;
      });
    });
  }
}

module.exports = MonorepoAliasPlugin; 