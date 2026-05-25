const express = require('express');
const MealPlan = require('../models/MealPlan');
const { protect } = require('../middleware/auth');

const router = express.Router();
router.use(protect);

// Helper: get Monday of a given date's week
const getMonday = (d) => {
  const date = new Date(d);
  const day = date.getDay();
  const diff = date.getDate() - day + (day === 0 ? -6 : 1);
  return new Date(date.setDate(diff));
};

// GET /api/mealplan?week=2024-01-15
router.get('/', async (req, res) => {
  try {
    const weekOf = req.query.week ? getMonday(req.query.week) : getMonday(new Date());
    let plan = await MealPlan.findOne({ user: req.user._id, weekOf })
      .populate('days.monday.breakfast days.monday.lunch days.monday.dinner')
      .populate('days.tuesday.breakfast days.tuesday.lunch days.tuesday.dinner')
      .populate('days.wednesday.breakfast days.wednesday.lunch days.wednesday.dinner')
      .populate('days.thursday.breakfast days.thursday.lunch days.thursday.dinner')
      .populate('days.friday.breakfast days.friday.lunch days.friday.dinner')
      .populate('days.saturday.breakfast days.saturday.lunch days.saturday.dinner')
      .populate('days.sunday.breakfast days.sunday.lunch days.sunday.dinner');

    if (!plan) {
      plan = await MealPlan.create({ user: req.user._id, weekOf });
    }
    res.json(plan);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

// PATCH /api/mealplan - Assign a recipe to a slot
router.patch('/', async (req, res) => {
  try {
    const { day, mealType, recipeId, week } = req.body;
    const weekOf = week ? getMonday(week) : getMonday(new Date());

    const update = { [`days.${day}.${mealType}`]: recipeId || null };

    const plan = await MealPlan.findOneAndUpdate(
      { user: req.user._id, weekOf },
      { $set: update },
      { new: true, upsert: true }
    ).populate('days.monday.breakfast days.monday.lunch days.monday.dinner')
     .populate('days.tuesday.breakfast days.tuesday.lunch days.tuesday.dinner')
     .populate('days.wednesday.breakfast days.wednesday.lunch days.wednesday.dinner')
     .populate('days.thursday.breakfast days.thursday.lunch days.thursday.dinner')
     .populate('days.friday.breakfast days.friday.lunch days.friday.dinner')
     .populate('days.saturday.breakfast days.saturday.lunch days.saturday.dinner')
     .populate('days.sunday.breakfast days.sunday.lunch days.sunday.dinner');

    res.json(plan);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

module.exports = router;