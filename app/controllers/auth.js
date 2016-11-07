
const jwt = require('koa-jwt');
const User = require('../models/user');

module.exports = {
  * signUp() {
    this.checkBody('password').notEmpty().len(6, 20).trim();
    if (this.errors) {
      this.throw(422);
    }

    this.body = yield User.create(this.request.body);
    this.status = 201;
  },

  * signIn() {
    this.checkBody('email').notEmpty().isEmail('Invalid Email').toLow().trim();
    this.checkBody('password').notEmpty().len(6, 20).trim();
    if (this.errors) {
      this.throw(422, 'Invalid email or password');
    }

    const email = this.request.body.email;
    const password = this.request.body.password;

    try {
      var user = yield User.authenticate(email, password);
    } catch (err) {
      this.throw(422, err.message);
    }

    const token = jwt.sign(user.toJSON(), process.env.AUTH_JWT_SECRET, { expiresInMinutes: 60 * 5 });
    this.body = { token };
  }
};
