const path = require('path');

class MonorepoAliasPlugin {
  constructor(options = {}) {
    this.options = {
      packages: [],
      rootDir: process.cwd(),
      ...options
    };
    
    // 初始化时生成别名映射
    this.aliasMap = this._generateAliasMap();
  }

  _generateAliasMap() {
    const aliasMap = new Map();
    
    this.options.packages.forEach(pkg => {
      // 支持字符串格式和对象格式的包配置
      const pkgName = typeof pkg === 'string' ? pkg : pkg.name;
      const pkgPath = typeof pkg === 'string' 
        ? path.join(this.options.rootDir, 'packages', pkg)
        : path.join(this.options.rootDir, pkg.path);
      
      aliasMap.set(pkgName, pkgPath);
    });
    
    return aliasMap;
  }

  apply(compiler) {
    compiler.hooks.normalModuleFactory.tap('MonorepoAliasPlugin', (normalModuleFactory) => {
      normalModuleFactory.hooks.beforeResolve.tap('MonorepoAliasPlugin', (resolveData) => {
        if (!resolveData) return;
        
        const { request } = resolveData;
        
        // 遍历所有包名，检查是否需要路径转换
        for (const [pkgName, pkgPath] of this.aliasMap) {
          if (request.startsWith(pkgName + '/')) {
            // 将包名替换为实际路径
            resolveData.request = path.join(
              pkgPath,
              request.slice(pkgName.length + 1)
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