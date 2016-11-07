
const Report = require('../models/report');

module.exports = {
  * reportParam(next) {
    this.checkParams('report').isObjectId();
    if (this.errors) {
      this.throw(422, 'Invalid Report id');
    }

    this.item = yield Report.findById(this.params.report);
    if (!this.item) {
      this.throw(404, 'Report not found');
    }

    yield next;
  },

  * list() {
    this.body = yield Report.find();
  },

  * create() {
    this.checkBody('date').notEmpty().isDate('Invalid Date');
    this.checkBody('timeTaken').notEmpty().isInt({ min: 0 });
    this.checkBody('description').notEmpty().trim();
    if (this.errors) {
      this.throw(422, 'Invalid params');
    }

    this.body = yield Report.create(this.request.body);
    this.status = 201;
  },

  * show() {
    this.body = this.item;
  },

  * update() {
    this.checkBody('date').notEmpty().isDate('Invalid Date');
    this.checkBody('timeTaken').notEmpty().isInt({ min: 0 });
    this.checkBody('description').notEmpty().trim();
    if (this.errors) {
      this.throw(422, 'Invalid params');
    }

    yield this.item.set(this.request.body).save();
    this.body = this.item;
  },

  * destroy() {
    yield this.item.remove();
    this.status = 204;
  }
};
