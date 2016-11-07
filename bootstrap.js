
require('dotenv').config({ silent: true });

const mongoose = require('mongoose');
mongoose.connect(process.env.MONGODB_URI);

require('./lib/validation');
