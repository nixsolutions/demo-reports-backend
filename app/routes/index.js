
const glob = require('glob');

module.exports = app => {
  glob.sync('**.js', { cwd: __dirname })
    .map(file => __dirname + '/' + file)
    .filter(path => path !== __filename)
    .map(require)
    .forEach(router => router(app));
};
