const mongoose = require('mongoose');

const TodoSchema = new mongoose.Schema({
  title: String,
  description: String,
  parentId: { type: mongoose.Schema.Types.ObjectId, default: null },
  isCompleted: Boolean,
  dueDate: Date,
  recurring: Boolean,
  type: String,
  lane: String,
  createdAt: { type: Date, default: Date.now },
  updatedAt: { type: Date, default: Date.now },
});

module.exports = mongoose.model('Todo', TodoSchema);

