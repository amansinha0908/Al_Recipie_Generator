const mongoose = require('mongoose');

const recipeSchema = new mongoose.Schema({
  user: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
  title: { type: String, required: true },
  description: { type: String },
  ingredients: [{ name: String, amount: String }],
  steps: [String],
  cuisine: { type: String },
  dietaryTags: [String],
  cookTime: { type: Number }, // in minutes
  servings: { type: Number, default: 2 },
  calories: { type: Number },
  difficulty: { type: String, enum: ['easy', 'medium', 'hard'], default: 'medium' },
  isSaved: { type: Boolean, default: false },
  // Store the prompt that generated this recipe (great for re-generation)
  generatedFrom: { type: String },
  aiGenerated: { type: Boolean, default: true },
}, { timestamps: true });

module.exports = mongoose.model('Recipe', recipeSchema);