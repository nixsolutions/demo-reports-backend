
const Router = require('koa-router');
const controller = require('../controllers/reports');
const permissions = require('../../config/permissions');

module.exports = app => {
  const router = Router({ prefix: '/reports' });

  router.get('/', app.acl.can(permissions.REPORTS_VIEW), controller.list);
  router.post('/', app.acl.can(permissions.REPORTS_CREATE), controller.create);
  router.get('/:report', app.acl.can(permissions.REPORTS_VIEW), controller.reportParam, controller.show);
  router.put('/:report', app.acl.can(permissions.REPORTS_EDIT), controller.reportParam, controller.update);
  router.del('/:report', app.acl.can(permissions.REPORTS_REMOVE), controller.reportParam, controller.destroy);

  app.use(router.routes());
  app.use(router.allowedMethods());
};
