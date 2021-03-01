// module.exports = {
//   configureWebpack: {
//     resolve: {
//       alias: {
//         'assets': '@/assets',
//         'components': '@/components',
//         'plugins': '@/plugins',
//         'views': '@/views',
//       }
//     }
//   }
// }

// const path = require('path');

// function resolve(dir) {
//   return path.join(__dirname, dir);
// }
// module.exports = {
//   lintOnSave: true,
//   chainWebpack: (config) => {
//     config.resolve.alias
//       .set('@', resolve('src'))
//       .set('assets',resolve('src/assets'))
//       .set('components',resolve('src/components'))
//   }
// };