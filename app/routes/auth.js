
const Router = require('koa-router');
const controller = require('../controllers/auth');
const permissions = require('../../config/permissions');

module.exports = app => {
  const router = Router({ prefix: '/auth' });

  router.post('/sign-in', app.acl.can(permissions.AUTH_SIGN_IN), controller.signIn);
  router.post('/sign-up', app.acl.can(permissions.AUTH_SIGN_UP), controller.signUp);

  app.use(router.routes());
  app.use(router.allowedMethods());
};
