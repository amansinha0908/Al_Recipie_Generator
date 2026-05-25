const express = require('express');
const { GoogleGenerativeAI } = require('@google/generative-ai');
const Recipe = require('../models/Recipe');
const { protect } = require('../middleware/auth');

const router = express.Router();
router.use(protect);

const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY);

router.post('/generate', async (req, res) => {
  try {
    const { ingredients, cuisine, mealType, dietary, maxTime } = req.body;

    // Very short prompt to avoid truncation
    const prompt = `Create a ${cuisine || 'Indian'} ${mealType || 'lunch'} recipe using ${ingredients || 'common ingredients'}.
${dietary && dietary !== 'None' ? 'Dietary: ' + dietary : ''}
Max time: ${maxTime || 45} mins.

Reply with ONLY this JSON (no extra text, keep all strings very short):
{
  "title": "Short Title",
  "description": "One short sentence.",
  "cuisine": "${cuisine || 'Indian'}",
  "dietaryTags": ["tag"],
  "cookTime": 30,
  "servings": 4,
  "calories": 350,
  "difficulty": "easy",
  "ingredients": [
    {"name": "item1", "amount": "100g"},
    {"name": "item2", "amount": "2 tbsp"},
    {"name": "item3", "amount": "1 cup"},
    {"name": "item4", "amount": "to taste"}
  ],
  "steps": [
    "Prepare ingredients.",
    "Cook on medium heat for 10 mins.",
    "Add spices and stir.",
    "Serve hot."
  ]
}`;

    const model = genAI.getGenerativeModel({
      model: 'gemini-2.5-flash',
      generationConfig: {
        temperature: 0.7,
        maxOutputTokens: 2048,
        responseMimeType: 'application/json',
      },
    });

    const result = await model.generateContent(prompt);
    const raw = result.response.text().trim();
    // console.log({raw: JSON.stringify(result)})

    console.log('Length:', raw.length);

    let recipeData;
    try {
      recipeData = JSON.parse(raw);
    } catch (e) {
      // Try to fix common JSON issues
      let fixed = raw
        .replace(/,\s*}/g, '}')      // trailing comma in object
        .replace(/,\s*]/g, ']')      // trailing comma in array
        .replace(/\n/g, ' ')         // newlines
        .replace(/[\x00-\x1F]/g, ''); // control chars

      // Find complete JSON object
      const start = fixed.indexOf('{');
      const end = fixed.lastIndexOf('}');
      if (start !== -1 && end !== -1) {
        fixed = fixed.slice(start, end + 1);
      }

      try {
        recipeData = JSON.parse(fixed);
      } catch (e2) {
        console.error('Parse failed after fix:', e2.message);
        // Build a fallback recipe from what we can extract
        recipeData = {
          title: raw.match(/"title"\s*:\s*"([^"]+)"/)?.[1] || 'Generated Recipe',
          description: raw.match(/"description"\s*:\s*"([^"]+)"/)?.[1] || 'A delicious recipe.',
          cuisine: cuisine || 'Indian',
          cookTime: parseInt(raw.match(/"cookTime"\s*:\s*(\d+)/)?.[1] || '30'),
          servings: 4,
          calories: parseInt(raw.match(/"calories"\s*:\s*(\d+)/)?.[1] || '350'),
          difficulty: 'medium',
          dietaryTags: [],
          ingredients: [{ name: 'See instructions for ingredients', amount: '' }],
          steps: ['Please regenerate for full recipe details.'],
        };
      }
    }

    // Sanitize
    recipeData.title = recipeData.title || 'Generated Recipe';
    recipeData.ingredients = Array.isArray(recipeData.ingredients)
      ? recipeData.ingredients.map(i => ({ name: String(i.name || ''), amount: String(i.amount || '') }))
      : [];
    recipeData.steps = Array.isArray(recipeData.steps)
      ? recipeData.steps.map(s => String(s))
      : [];
    recipeData.dietaryTags = Array.isArray(recipeData.dietaryTags) ? recipeData.dietaryTags : [];

    const recipe = await Recipe.create({
      ...recipeData,
      user: req.user._id,
      generatedFrom: `${ingredients} | ${cuisine} | ${mealType}`,
      aiGenerated: true,
    });

    console.log(`Saved: "${recipe.title}" | ${recipe.ingredients.length} ing | ${recipe.steps.length} steps`);
    res.status(201).json(recipe);

  } catch (err) {
    console.error('Error:', err.message);
    res.status(500).json({ message: 'Failed to generate. Please try again.', error: err.message });
  }
});

router.get('/', async (req, res) => {
  try {
    const { saved, cuisine, dietary } = req.query;
    const filter = { user: req.user._id };
    if (saved === 'true') filter.isSaved = true;
    if (cuisine) filter.cuisine = new RegExp(cuisine, 'i');
    if (dietary) filter.dietaryTags = { $in: [dietary] };
    const recipes = await Recipe.find(filter).sort('-createdAt');
    res.json(recipes);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

router.get('/:id', async (req, res) => {
  try {
    const recipe = await Recipe.findOne({ _id: req.params.id, user: req.user._id });
    if (!recipe) return res.status(404).json({ message: 'Recipe not found' });
    res.json(recipe);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

router.patch('/:id/save', async (req, res) => {
  try {
    const recipe = await Recipe.findOne({ _id: req.params.id, user: req.user._id });
    if (!recipe) return res.status(404).json({ message: 'Recipe not found' });
    recipe.isSaved = !recipe.isSaved;
    await recipe.save();
    res.json(recipe);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

router.delete('/:id', async (req, res) => {
  try {
    await Recipe.findOneAndDelete({ _id: req.params.id, user: req.user._id });
    res.json({ message: 'Recipe deleted' });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

module.exports = router;