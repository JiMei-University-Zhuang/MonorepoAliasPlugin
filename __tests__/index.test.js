const path = require('path');
const MonorepoAliasPlugin = require('../src');

describe('MonorepoAliasPlugin', () => {
  it('should be instantiable', () => {
    const plugin = new MonorepoAliasPlugin();
    expect(plugin).toBeInstanceOf(MonorepoAliasPlugin);
  });

  it('should merge options with defaults', () => {
    const plugin = new MonorepoAliasPlugin({
      packages: ['package-a']
    });
    expect(plugin.options.packages).toEqual(['package-a']);
    expect(plugin.options.rootDir).toBeDefined();
  });

  describe('_generateAliasMap', () => {
    it('should generate alias map from string package names', () => {
      const plugin = new MonorepoAliasPlugin({
        packages: ['package-a', 'package-b'],
        rootDir: '/root'
      });
      
      const aliasMap = plugin.aliasMap;
      expect(aliasMap.get('package-a')).toBe(path.join('/root', 'packages', 'package-a'));
      expect(aliasMap.get('package-b')).toBe(path.join('/root', 'packages', 'package-b'));
    });

    it('should generate alias map from package objects', () => {
      const plugin = new MonorepoAliasPlugin({
        packages: [
          { name: 'package-a', path: 'custom/path/package-a' }
        ],
        rootDir: '/root'
      });
      
      const aliasMap = plugin.aliasMap;
      expect(aliasMap.get('package-a')).toBe(path.join('/root', 'custom/path/package-a'));
    });
  });

  describe('path resolution', () => {
    it('should resolve package paths correctly', () => {
      const plugin = new MonorepoAliasPlugin({
        packages: ['package-a'],
        rootDir: '/root'
      });

      const resolveData = {
        request: 'package-a/src/component',
        context: {}
      };

      // 模拟 webpack 编译器
      const compiler = {
        hooks: {
          normalModuleFactory: {
            tap: (name, callback) => {
              const factory = {
                hooks: {
                  beforeResolve: {
                    tap: (name, callback) => {
                      callback(resolveData);
                    }
                  }
                }
              };
              callback(factory);
            }
          }
        }
      };

      plugin.apply(compiler);
      
      expect(resolveData.request).toBe(
        path.join('/root', 'packages', 'package-a', 'src', 'component')
      );
    });
  });
}); 