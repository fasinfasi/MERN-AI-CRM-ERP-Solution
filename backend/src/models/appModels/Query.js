const { required } = require('joi');
const mongoose = require('mongoose');

const noteSchema = new mongoose.Schema({
  text: { type: String, required: true },
  author: { type: mongoose.Schema.ObjectId, ref: 'Admin' },
  created: { type: Date, default: Date.now }
});

const querySchema = new mongoose.Schema({
    customer: { type: mongoose.Schema.ObjectId, ref: 'Client', required: true },
    description: { type: String, required: true },
    created: { type: Date, default: Date.now },
    status: { type: String, enum: ['Open', 'Inprogress', 'Closed'], default: 'Open' },
    resolution: { type: String, default: '' },
    notes: [noteSchema],
    removed: { type: Boolean, default: false}
});

module.exports = mongoose.model('Query', querySchema);