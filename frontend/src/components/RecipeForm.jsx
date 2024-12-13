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
    <div className="min-h-screen bg-gradient-to-br from-primary-50 to-accent-50">
      <Navbar />
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="bg-white shadow-custom-lg rounded-xl p-6">
          <h2 className="text-2xl font-bold text-secondary-800 mb-6">
            {id ? 'Edit Recipe' : 'Create New Recipe'}
          </h2>
          <form onSubmit={handleSubmit} className="space-y-6">
            <div>
              <label className="block text-sm font-medium text-secondary-700">
                Recipe Title
              </label>
              <input
                type="text"
                name="title"
                value={formData.title}
                onChange={handleChange}
                required
                className="mt-1 block w-full px-3 py-2 border border-secondary-300 rounded-lg shadow-sm focus:ring-primary-500 focus:border-primary-500 transition duration-150"
                placeholder="Enter recipe title"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-secondary-700">
                Ingredients (one per line)
              </label>
              <textarea
                name="ingredients"
                value={formData.ingredients}
                onChange={handleChange}
                required
                rows={5}
                className="mt-1 block w-full px-3 py-2 border border-secondary-300 rounded-lg shadow-sm focus:ring-primary-500 focus:border-primary-500 transition duration-150"
                placeholder="Enter ingredients, one per line"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-secondary-700">
                Instructions
              </label>
              <textarea
                name="instructions"
                value={formData.instructions}
                onChange={handleChange}
                required
                rows={5}
                className="mt-1 block w-full px-3 py-2 border border-secondary-300 rounded-lg shadow-sm focus:ring-primary-500 focus:border-primary-500 transition duration-150"
                placeholder="Enter cooking instructions"
              />
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <label className="block text-sm font-medium text-secondary-700">
                  Cuisine Type
                </label>
                <input
                  type="text"
                  name="cuisineType"
                  value={formData.cuisineType}
                  onChange={handleChange}
                  required
                  className="mt-1 block w-full px-3 py-2 border border-secondary-300 rounded-lg shadow-sm focus:ring-primary-500 focus:border-primary-500 transition duration-150"
                  placeholder="Enter cuisine type"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-secondary-700">
                  Cooking Time (minutes)
                </label>
                <input
                  type="number"
                  name="cookingTime"
                  value={formData.cookingTime}
                  onChange={handleChange}
                  required
                  min="1"
                  className="mt-1 block w-full px-3 py-2 border border-secondary-300 rounded-lg shadow-sm focus:ring-primary-500 focus:border-primary-500 transition duration-150"
                  placeholder="Enter cooking time"
                />
              </div>
            </div>

            <div className="flex justify-end space-x-4">
              <button
                type="button"
                onClick={() => navigate('/recipes')}
                className="px-4 py-2 border border-secondary-300 rounded-lg text-secondary-700 hover:bg-secondary-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-primary-500 transition duration-150"
              >
                Cancel
              </button>
              <button
                type="submit"
                disabled={loading}
                className={`px-4 py-2 border border-transparent rounded-lg text-white bg-primary-600 hover:bg-primary-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-primary-500 transition duration-150 ${
                  loading ? 'opacity-50 cursor-not-allowed' : ''
                }`}
              >
                {loading ? (
                  <div className="flex items-center">
                    <svg className="animate-spin -ml-1 mr-3 h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                      <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                      <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                    </svg>
                    {id ? 'Updating...' : 'Creating...'}
                  </div>
                ) : (
                  id ? 'Update Recipe' : 'Create Recipe'
                )}
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
}

export default RecipeForm; 