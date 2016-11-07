const Roles = require('koa-roles');
const { rules, ROLE_GUEST, ROLE_ADMIN } = require('../config/permissions');

module.exports = app => {
  const acl = new Roles({
    failureHandler: function* failureHandler(action) {
      this.throw(403, `Access forbidden for: ${action}`);
    }
  });

  acl.use(function* middleware(action) {
    const role = this.state.user && this.state.user.role || ROLE_GUEST;

    if (role === ROLE_ADMIN) {
      return true;
    }

    if (rules[role] && rules[role].includes(action)) {
      return true;
    }
  });

  app.acl = acl;
  app.use(acl.middleware());
};
