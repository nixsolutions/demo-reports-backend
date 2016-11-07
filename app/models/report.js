const mongoose = require('mongoose');
const timestamps = require('mongoose-timestamp');

const schema = new mongoose.Schema({
  date:        { type: Date,   required: true },
  timeTaken:   { type: Number, required: true, default: 0 },
  description: { type: String, required: true, trim: true }
});

schema.plugin(timestamps, { createdAt: 'created', updatedAt: 'updated' });

schema.methods.toJSON = function toJSON() {
  return {
    id: this._id,
    date: this.date,
    timeTaken: this.timeTaken,
    description: this.description
  };
};

module.exports = mongoose.model('Report', schema);
