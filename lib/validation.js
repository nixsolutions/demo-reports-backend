const Validator = require('koa-validate').Validator;
const validator = require('validator');

Validator.prototype.isObjectId = function isObjectId(tip) {
  if (this.goOn && !validator.isMongoId(this.value)) {
    this.addError(tip || 'id param is not id');
  }
  return this;
};
