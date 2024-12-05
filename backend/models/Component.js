const mongoose = require('mongoose');

// Definicija sheme za komponento
const componentSchema = new mongoose.Schema({
  userName: {
    type: String,
    required: true,
  },
  componentName: {
    type: String,
    required: true,
  },
  price: {
    type: Number,
    required: true,
  },
  date: {
    type: Date,
    default: Date.now,
  },
});

// Ustvarite Mongoose model na podlagi sheme
const Component = mongoose.model('Component', componentSchema);

module.exports = Component;
