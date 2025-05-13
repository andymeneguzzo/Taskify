const mongoose = require('mongoose');

const subtopicSchema = new mongoose.Schema({
  title: { type: String, required: true },
  completed: { type: Boolean, default: false },
  attachmentUrl: { type: String } // For optional PDF attachment
});

const topicSchema = new mongoose.Schema({
  title: { type: String, required: true },
  description: String,
  user: { type: mongoose.Schema.Types.ObjectId, ref: 'User' },
  subtopics: [subtopicSchema],
  attachmentUrl: String, // Main topic PDF
}, { timestamps: true });

module.exports = mongoose.model('Topic', topicSchema);
