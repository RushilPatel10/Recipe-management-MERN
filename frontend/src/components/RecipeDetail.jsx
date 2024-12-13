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
      toast.error('Error fetching recipe details');
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
      <div className="min-h-screen bg-gray-50">
        <Navbar />
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          <div className="text-center">
            <div className="animate-spin rounded-full h-32 w-32 border-b-2 border-indigo-500 mx-auto"></div>
            <p className="mt-4 text-gray-600">Loading recipe details...</p>
          </div>
        </div>
      </div>
    );
  }

  if (!recipe) {
    return (
      <div className="min-h-screen bg-gray-50">
        <Navbar />
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          <div className="text-center">
            <p className="text-gray-600">Recipe not found</p>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <Navbar />
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="bg-white shadow rounded-lg overflow-hidden">
          <div className="p-6">
            <div className="flex justify-between items-center mb-6">
              <h1 className="text-3xl font-bold text-gray-900">{recipe.title}</h1>
              <div className="space-x-4">
                <Link
                  to={`/recipes/edit/${recipe._id}`}
                  className="text-blue-600 hover:text-blue-800"
                >
                  Edit
                </Link>
                <button
                  onClick={handleDelete}
                  className="text-red-600 hover:text-red-800"
                >
                  Delete
                </button>
              </div>
            </div>

            <div className="space-y-6">
              <div>
                <h2 className="text-xl font-semibold text-gray-900 mb-2">
                  Cuisine Type
                </h2>
                <p className="text-gray-600">{recipe.cuisineType}</p>
              </div>

              <div>
                <h2 className="text-xl font-semibold text-gray-900 mb-2">
                  Cooking Time
                </h2>
                <p className="text-gray-600">{recipe.cookingTime} minutes</p>
              </div>

              <div>
                <h2 className="text-xl font-semibold text-gray-900 mb-2">
                  Ingredients
                </h2>
                <ul className="list-disc list-inside text-gray-600">
                  {recipe.ingredients.map((ingredient, index) => (
                    <li key={index}>{ingredient}</li>
                  ))}
                </ul>
              </div>

              <div>
                <h2 className="text-xl font-semibold text-gray-900 mb-2">
                  Instructions
                </h2>
                <p className="text-gray-600 whitespace-pre-line">
                  {recipe.instructions}
                </p>
              </div>
            </div>

            <div className="mt-8">
              <Link
                to="/recipes"
                className="text-indigo-600 hover:text-indigo-800"
              >
                ← Back to Recipes
              </Link>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default RecipeDetail; 