import { useState, useEffect } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import axios from '../utils/axios';
import { toast } from 'react-toastify';
import Navbar from './Layout/Navbar';

function RecipeForm() {
  const { id } = useParams();
  const navigate = useNavigate();
  const [loading, setLoading] = useState(false);
  const [formData, setFormData] = useState({
    title: '',
    ingredients: '',
    instructions: '',
    cuisineType: '',
    cookingTime: ''
  });

  useEffect(() => {
    if (id) {
      fetchRecipe();
    }
  }, [id]);

  const fetchRecipe = async () => {
    try {
      const response = await axios.get(`/recipes/${id}`);
      const recipe = response.data;
      setFormData({
        title: recipe.title,
        ingredients: recipe.ingredients.join('\n'),
        instructions: recipe.instructions,
        cuisineType: recipe.cuisineType,
        cookingTime: recipe.cookingTime
      });
    } catch (error) {
      toast.error('Error fetching recipe');
      navigate('/recipes');
    }
  };

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);

    try {
      const ingredientsArray = formData.ingredients
        .split('\n')
        .filter(i => i.trim())
        .map(i => i.trim());

      const recipeData = {
        title: formData.title,
        ingredients: ingredientsArray,
        instructions: formData.instructions,
        cuisineType: formData.cuisineType,
        cookingTime: Number(formData.cookingTime)
      };

      if (id) {
        await axios.put(`/recipes/${id}`, recipeData);
        toast.success('Recipe updated successfully!');
      } else {
        await axios.post('/recipes', recipeData);
        toast.success('Recipe created successfully!');
      }
      navigate('/recipes');
    } catch (error) {
      toast.error(error.response?.data?.message || 'Error saving recipe');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gray-50">
      <Navbar />
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="bg-white shadow rounded-lg p-6">
          <h2 className="text-2xl font-bold mb-6">
            {id ? 'Edit Recipe' : 'Create New Recipe'}
          </h2>
          <form onSubmit={handleSubmit}>
            <div className="space-y-6">
              <div>
                <label className="block text-sm font-medium text-gray-700">
                  Title
                </label>
                <input
                  type="text"
                  name="title"
                  value={formData.title}
                  onChange={handleChange}
                  required
                  className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700">
                  Ingredients (one per line)
                </label>
                <textarea
                  name="ingredients"
                  value={formData.ingredients}
                  onChange={handleChange}
                  required
                  rows={5}
                  className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700">
                  Instructions
                </label>
                <textarea
                  name="instructions"
                  value={formData.instructions}
                  onChange={handleChange}
                  required
                  rows={5}
                  className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700">
                  Cuisine Type
                </label>
                <input
                  type="text"
                  name="cuisineType"
                  value={formData.cuisineType}
                  onChange={handleChange}
                  required
                  className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700">
                  Cooking Time (minutes)
                </label>
                <input
                  type="number"
                  name="cookingTime"
                  value={formData.cookingTime}
                  onChange={handleChange}
                  required
                  min="1"
                  className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500"
                />
              </div>

              <button
                type="submit"
                disabled={loading}
                className={`w-full py-2 px-4 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 ${
                  loading ? 'opacity-50 cursor-not-allowed' : ''
                }`}
              >
                {loading ? 'Saving...' : (id ? 'Update Recipe' : 'Create Recipe')}
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
}

export default RecipeForm; 