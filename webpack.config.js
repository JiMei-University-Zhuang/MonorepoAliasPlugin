const MonorepoAliasPlugin = require('./plugins/MonorepoAliasPlugin');
const path = require('path');

module.exports = {
  // ... 其他 webpack 配置
  plugins: [
    new MonorepoAliasPlugin({
      packages: [
        'package-a',
        'package-b',
        {
          name: 'package-c',
          path: 'packages/custom/package-c'
        }
      ],
      rootDir: path.resolve(__dirname, '../')
    })
  ]
}; 