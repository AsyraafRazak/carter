const mongoose = require('mongoose');
require('dotenv').config();

mongoose.connect(process.env.MONGO_URI)
  .then(() => {
    console.log('CONNECTED');
    process.exit(0);
  })
  .catch(err => {
    console.error('ERROR:', err);
    process.exit(1);
  });