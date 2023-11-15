const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const animalsSchema = new Schema({
  name: {
    type: String,
    required: true,
  },
  color: {
    type: String,
    required: true,
  },
});

const Animals = mongoose.model('Animals', animalsSchema);

module.exports = Animals;
