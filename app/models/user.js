const mongoose = require('mongoose');
const timestamps = require('mongoose-timestamp');
const uniqueValidator = require('mongoose-unique-validator');
const validate = require('mongoose-validator');
const bcrypt = require('bcrypt');

const { ROLE_GUEST, ROLE_USER } = require('../../config/permissions');
const ROLES = [ROLE_GUEST, ROLE_USER];

const schema = new mongoose.Schema({
  email:     { type: String, trim: true, required: true, unique: true, validate: validate({ validator: 'isEmail' }) },
  password:  { type: String, trim: true, required: true },
  role:      { type: String, trim: true, required: true, default: ROLE_USER, enum: ROLES },
  firstName: { type: String, trim: true, required: true },
  lastName:  { type: String, trim: true, required: true }
});

schema.plugin(timestamps, { createdAt: 'created', updatedAt: 'updated' });
schema.plugin(uniqueValidator, 'Error, expected {PATH} to be unique');

schema.pre('save', function preSave(next) {
  if (!this.isModified('password')) {
    return next();
  }
  bcrypt.hash(this.password, 10, (err, hash) => {
    if (err) {
      return next(err);
    }
    this.password = hash;
    return next();
  });
});

schema.methods.toJSON = function toJSON() {
  return {
    id: this._id,
    firstName: this.firstName,
    lastName: this.lastName,
    email: this.email,
    role: this.role
  };
};

schema.statics.authenticate = function* authenticate(email, password) {
  const user = yield this.findOne({ email }).exec();
  if (!user) {
    throw new Error('Wrong email or password');
  }
  if (!bcrypt.compareSync(password, user.password)) {
    throw new Error('Wrong email or password');
  }
  return user;
};

module.exports = mongoose.model('User', schema);
