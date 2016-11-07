
module.exports = function* (next) {
  try {
    yield next;
    if (!this.status || this.status === 404) {
      this.throw(404);
    }
  } catch (err) {
    this.status = err.status || 500;
    this.body = {
      name: err.name,
      message: err.message || 'Internal Error'
    };
    if (this.app.env === 'development') {
      this.body.stack = err.stack;
    }
    // map mongoose errors
    if (err.errors) {
      this.body.errors = Object.keys(err.errors).map(key => {
        const { path, message } = err.errors[key];
        return { path, message };
      });
    }
    // map koa-validate errors
    if (this.errors) {
      this.body.errors = this.errors.map(error => {
        const path = Object.keys(error)[0];
        const message = error[path];
        return { message, path };
      });
    }
  }
};
