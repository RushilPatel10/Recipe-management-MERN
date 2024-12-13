import { useState, useEffect } from 'react';
import { useParams, useNavigate, Link } from 'react-router-dom';
import axios from '../utils/axios';
import { toast } from 'react-toastify';
import Navbar from './Layout/Navbar';

function RecipeDetail() {
  const { id } = useParams();
  const navigate = useNavigate();
  const [recipe, setRecipe] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchRecipe();
  }, [id]);

  const fetchRecipe = async () => {
    try {
      const response = await axios.get(`/recipes/${id}`);
      setRecipe(response.data);
    } catch (error) {
      toast.error('Error fetching recipe');
      navigate('/recipes');
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = async () => {
    if (window.confirm('Are you sure you want to delete this recipe?')) {
      try {
        await axios.delete(`/recipes/${id}`);
        toast.success('Recipe deleted successfully');
        navigate('/recipes');
      } catch (error) {
        toast.error('Error deleting recipe');
      }
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-primary-50 to-accent-50">
        <Navbar />
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          <div className="flex justify-center items-center h-64">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary-600"></div>
          </div>
        </div>
      </div>
    );
  }

  if (!recipe) return null;

  return (
    <div className="min-h-screen bg-gradient-to-br from-primary-50 to-accent-50">
      <Navbar />
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="bg-white shadow-custom-lg rounded-xl overflow-hidden">
          <div className="p-6">
            <div className="flex justify-between items-start mb-6">
              <h1 className="text-3xl font-bold text-secondary-800">{recipe.title}</h1>
              <div className="flex space-x-3">
                <Link
                  to={`/recipes/edit/${recipe._id}`}
                  className="px-4 py-2 bg-primary-50 text-primary-700 rounded-lg hover:bg-primary-100 transition duration-150"
                >
                  Edit Recipe
                </Link>
                <button
                  onClick={handleDelete}
                  className="px-4 py-2 bg-red-50 text-red-700 rounded-lg hover:bg-red-100 transition duration-150"
                >
                  Delete
                </button>
              </div>
            </div>

            <div className="grid grid-cols-2 gap-4 mb-6">
              <div className="bg-secondary-50 p-4 rounded-lg">
                <h3 className="text-sm font-medium text-secondary-500">Cuisine Type</h3>
                <p className="mt-1 text-lg font-semibold text-secondary-900">{recipe.cuisineType}</p>
              </div>
              <div className="bg-secondary-50 p-4 rounded-lg">
                <h3 className="text-sm font-medium text-secondary-500">Cooking Time</h3>
                <p className="mt-1 text-lg font-semibold text-secondary-900">{recipe.cookingTime} minutes</p>
              </div>
            </div>

            <div className="space-y-6">
              <div>
                <h2 className="text-xl font-semibold text-secondary-900 mb-3">Ingredients</h2>
                <ul className="bg-secondary-50 rounded-lg p-4 space-y-2">
                  {recipe.ingredients.map((ingredient, index) => (
                    <li key={index} className="flex items-center text-secondary-700">
                      <span className="w-2 h-2 bg-primary-500 rounded-full mr-2"></span>
                      {ingredient}
                    </li>
                  ))}
                </ul>
              </div>

              <div>
                <h2 className="text-xl font-semibold text-secondary-900 mb-3">Instructions</h2>
                <div className="bg-secondary-50 rounded-lg p-4">
                  <p className="text-secondary-700 whitespace-pre-line">{recipe.instructions}</p>
                </div>
              </div>
            </div>

            <div className="mt-8">
              <Link
                to="/recipes"
                className="inline-flex items-center text-primary-600 hover:text-primary-700 transition duration-150"
              >
                <svg className="w-5 h-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M10 19l-7-7m0 0l7-7m-7 7h18" />
                </svg>
                Back to Recipes
              </Link>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default RecipeDetail; 