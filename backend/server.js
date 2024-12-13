const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
const authRoutes = require('./routes/auth');
const auth = require('./middleware/auth');
const Recipe = require('./models/Recipe');
require('dotenv').config();

const app = express();

app.use(cors({
  origin: ['http://localhost:3000', 'http://localhost:5173'],
  credentials: true,
  methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS'],
  allowedHeaders: ['Content-Type', 'Authorization']
}));

app.use(express.json());
app.use('/api/auth', authRoutes);

// Get all recipes
app.get('/api/recipes', auth, async (req, res) => {
  try {
    const recipes = await Recipe.find({ author: req.userId });
    res.json(recipes);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

// Get single recipe
app.get('/api/recipes/:id', auth, async (req, res) => {
  try {
    const recipe = await Recipe.findOne({ _id: req.params.id, author: req.userId });
    if (!recipe) {
      return res.status(404).json({ message: 'Recipe not found' });
    }
    res.json(recipe);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

// Create recipe
app.post('/api/recipes', auth, async (req, res) => {
  try {
    const { title, ingredients, instructions, cuisineType, cookingTime } = req.body;
    
    // Validate required fields
    if (!title || !ingredients || !instructions || !cuisineType || !cookingTime) {
      return res.status(400).json({ message: 'All fields are required' });
    }

    // Parse ingredients if it's a string
    const parsedIngredients = Array.isArray(ingredients) 
      ? ingredients 
      : typeof ingredients === 'string'
      ? JSON.parse(ingredients)
      : [ingredients];

    const recipe = new Recipe({
      title,
      ingredients: parsedIngredients,
      instructions,
      cuisineType,
      cookingTime: Number(cookingTime),
      author: req.userId
    });

    const savedRecipe = await recipe.save();
    res.status(201).json(savedRecipe);
  } catch (error) {
    console.error('Error creating recipe:', error);
    res.status(500).json({ 
      message: 'Error creating recipe', 
      error: error.message 
    });
  }
});

// Update recipe
app.put('/api/recipes/:id', auth, async (req, res) => {
  try {
    const { title, ingredients, instructions, cuisineType, cookingTime } = req.body;
    
    // Validate required fields
    if (!title || !ingredients || !instructions || !cuisineType || !cookingTime) {
      return res.status(400).json({ message: 'All fields are required' });
    }

    // Parse ingredients if it's a string
    const parsedIngredients = Array.isArray(ingredients) 
      ? ingredients 
      : typeof ingredients === 'string'
      ? JSON.parse(ingredients)
      : [ingredients];

    const recipe = await Recipe.findOneAndUpdate(
      { _id: req.params.id, author: req.userId },
      {
        title,
        ingredients: parsedIngredients,
        instructions,
        cuisineType,
        cookingTime: Number(cookingTime)
      },
      { new: true }
    );

    if (!recipe) {
      return res.status(404).json({ message: 'Recipe not found' });
    }

    res.json(recipe);
  } catch (error) {
    console.error('Error updating recipe:', error);
    res.status(500).json({ 
      message: 'Error updating recipe', 
      error: error.message 
    });
  }
});

// Delete recipe
app.delete('/api/recipes/:id', auth, async (req, res) => {
  try {
    const recipe = await Recipe.findOneAndDelete({ _id: req.params.id, author: req.userId });
    if (!recipe) {
      return res.status(404).json({ message: 'Recipe not found' });
    }
    res.json({ message: 'Recipe deleted successfully' });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

const PORT = process.env.PORT || 5000;
mongoose.connect(process.env.MONGODB_URI)
  .then(() => {
    console.log('Connected to MongoDB');
    app.listen(PORT, () => console.log(`Server running on port ${PORT}`));
  })
  .catch((error) => console.error('MongoDB connection error:', error));