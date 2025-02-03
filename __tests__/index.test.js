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
}); 