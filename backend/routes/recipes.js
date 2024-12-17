const express = require('express');
const router = express.Router();
const auth = require('../middleware/auth');
const Recipe = require('../models/Recipe');

// Get all recipes
router.get('/', auth, async (req, res) => {
  try {
    const recipes = await Recipe.find({ author: req.userId });
    res.json(recipes);
  } catch (error) {
    res.status(500).json({ message: 'Server error' });
  }
});

// Get single recipe
router.get('/:id', auth, async (req, res) => {
  try {
    const recipe = await Recipe.findOne({ _id: req.params.id, author: req.userId });
    if (!recipe) {
      return res.status(404).json({ message: 'Recipe not found' });
    }
    res.json(recipe);
  } catch (error) {
    res.status(500).json({ message: 'Server error' });
  }
});

// Create recipe
router.post('/', auth, async (req, res) => {
  try {
    const { title, ingredients, instructions, cuisineType, cookingTime } = req.body;
    
    const recipe = new Recipe({
      title,
      ingredients: Array.isArray(ingredients) ? ingredients : [ingredients],
      instructions,
      cuisineType,
      cookingTime: Number(cookingTime),
      author: req.userId
    });

    const savedRecipe = await recipe.save();
    res.status(201).json(savedRecipe);
  } catch (error) {
    res.status(500).json({ message: 'Server error' });
  }
});

// Update recipe
router.put('/:id', auth, async (req, res) => {
  try {
    const { title, ingredients, instructions, cuisineType, cookingTime } = req.body;
    
    const recipe = await Recipe.findOneAndUpdate(
      { _id: req.params.id, author: req.userId },
      {
        title,
        ingredients: Array.isArray(ingredients) ? ingredients : [ingredients],
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
    res.status(500).json({ message: 'Server error' });
  }
});

// Delete recipe
router.delete('/:id', auth, async (req, res) => {
  try {
    const recipe = await Recipe.findOneAndDelete({ _id: req.params.id, author: req.userId });
    if (!recipe) {
      return res.status(404).json({ message: 'Recipe not found' });
    }
    res.json({ message: 'Recipe deleted' });
  } catch (error) {
    res.status(500).json({ message: 'Server error' });
  }
});

module.exports = router; 