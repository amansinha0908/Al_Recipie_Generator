const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
require('dotenv').config();

const authRoutes = require('./routes/auth');
const recipeRoutes = require('./routes/recipes');
const mealPlanRoutes = require('./routes/mealplan');

const app = express();

app.use(cors());
app.use(express.json());

app.use('/api/auth', authRoutes);
app.use('/api/recipes', recipeRoutes);
app.use('/api/mealplan', mealPlanRoutes);

app.get('/api/health', (req, res) => res.json({ status: 'OK', app: 'RecipAI' }));

const PORT = process.env.PORT || 5000;
const MONGO_URI = process.env.MONGO_URI || 'mongodb://localhost:27017/recipai';

mongoose
  .connect(MONGO_URI)
  .then(() => {
    console.log('✅ MongoDB connected');
    app.listen(PORT, () => console.log(`🚀 RecipAI API on port ${PORT}`));
  })
  .catch((err) => console.error('DB Error:', err));