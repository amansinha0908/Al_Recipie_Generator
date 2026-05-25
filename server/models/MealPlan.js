const mongoose = require('mongoose');

const mealPlanSchema = new mongoose.Schema({
  user: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
  weekOf: { type: Date, required: true }, // Monday of the week
  days: {
    monday:    { breakfast: { type: mongoose.Schema.Types.ObjectId, ref: 'Recipe' }, lunch: { type: mongoose.Schema.Types.ObjectId, ref: 'Recipe' }, dinner: { type: mongoose.Schema.Types.ObjectId, ref: 'Recipe' } },
    tuesday:   { breakfast: { type: mongoose.Schema.Types.ObjectId, ref: 'Recipe' }, lunch: { type: mongoose.Schema.Types.ObjectId, ref: 'Recipe' }, dinner: { type: mongoose.Schema.Types.ObjectId, ref: 'Recipe' } },
    wednesday: { breakfast: { type: mongoose.Schema.Types.ObjectId, ref: 'Recipe' }, lunch: { type: mongoose.Schema.Types.ObjectId, ref: 'Recipe' }, dinner: { type: mongoose.Schema.Types.ObjectId, ref: 'Recipe' } },
    thursday:  { breakfast: { type: mongoose.Schema.Types.ObjectId, ref: 'Recipe' }, lunch: { type: mongoose.Schema.Types.ObjectId, ref: 'Recipe' }, dinner: { type: mongoose.Schema.Types.ObjectId, ref: 'Recipe' } },
    friday:    { breakfast: { type: mongoose.Schema.Types.ObjectId, ref: 'Recipe' }, lunch: { type: mongoose.Schema.Types.ObjectId, ref: 'Recipe' }, dinner: { type: mongoose.Schema.Types.ObjectId, ref: 'Recipe' } },
    saturday:  { breakfast: { type: mongoose.Schema.Types.ObjectId, ref: 'Recipe' }, lunch: { type: mongoose.Schema.Types.ObjectId, ref: 'Recipe' }, dinner: { type: mongoose.Schema.Types.ObjectId, ref: 'Recipe' } },
    sunday:    { breakfast: { type: mongoose.Schema.Types.ObjectId, ref: 'Recipe' }, lunch: { type: mongoose.Schema.Types.ObjectId, ref: 'Recipe' }, dinner: { type: mongoose.Schema.Types.ObjectId, ref: 'Recipe' } },
  },
}, { timestamps: true });

module.exports = mongoose.model('MealPlan', mealPlanSchema);