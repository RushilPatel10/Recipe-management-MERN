import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import axios from '../utils/axios';
import { toast } from 'react-toastify';
import Navbar from './Layout/Navbar';

function RecipeList() {
  const [recipes, setRecipes] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [filterType, setFilterType] = useState('title'); // 'title' or 'cuisineType'

  useEffect(() => {
    fetchRecipes();
  }, []);

  const fetchRecipes = async () => {
    try {
      const response = await axios.get('/recipes');
      setRecipes(response.data);
    } catch (error) {
      toast.error('Error fetching recipes');
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = async (id) => {
    if (window.confirm('Are you sure you want to delete this recipe?')) {
      try {
        await axios.delete(`/recipes/${id}`);
        toast.success('Recipe deleted successfully');
        fetchRecipes();
      } catch (error) {
        toast.error('Error deleting recipe');
      }
    }
  };

  // Filter recipes based on search term and filter type
  const filteredRecipes = recipes.filter(recipe => {
    const searchLower = searchTerm.toLowerCase();
    if (filterType === 'title') {
      return recipe.title.toLowerCase().includes(searchLower);
    } else if (filterType === 'cuisineType') {
      return recipe.cuisineType.toLowerCase().includes(searchLower);
    }
    return true;
  });

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50">
        <Navbar />
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          <div className="text-center">
            <div className="animate-spin rounded-full h-32 w-32 border-b-2 border-indigo-500 mx-auto"></div>
            <p className="mt-4 text-gray-600">Loading recipes...</p>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <Navbar />
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="flex justify-between items-center mb-6">
          <h1 className="text-3xl font-bold text-gray-900">My Recipes</h1>
          <Link
            to="/recipes/new"
            className="bg-indigo-600 text-white px-4 py-2 rounded-md hover:bg-indigo-700"
          >
            Add New Recipe
          </Link>
        </div>

        {/* Search and Filter Section */}
        <div className="mb-6 flex flex-col sm:flex-row gap-4">
          <div className="flex-1">
            <input
              type="text"
              placeholder="Search recipes..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full px-4 py-2 border border-gray-300 rounded-md focus:ring-indigo-500 focus:border-indigo-500"
            />
          </div>
          <div className="sm:w-48">
            <select
              value={filterType}
              onChange={(e) => setFilterType(e.target.value)}
              className="w-full px-4 py-2 border border-gray-300 rounded-md focus:ring-indigo-500 focus:border-indigo-500"
            >
              <option value="title">Search by Title</option>
              <option value="cuisineType">Search by Cuisine</option>
            </select>
          </div>
        </div>

        {filteredRecipes.length === 0 ? (
          <div className="text-center py-12">
            {searchTerm ? (
              <p className="text-gray-500 text-lg">No recipes found matching your search.</p>
            ) : (
              <p className="text-gray-500 text-lg">No recipes found. Start by adding a new recipe!</p>
            )}
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {filteredRecipes.map((recipe) => (
              <div
                key={recipe._id}
                className="bg-white rounded-lg shadow-md overflow-hidden hover:shadow-lg transition-shadow duration-300"
              >
                <div className="p-6">
                  <h2 className="text-xl font-semibold text-gray-900 mb-2">
                    {recipe.title}
                  </h2>
                  <p className="text-gray-600 mb-2">
                    <span className="font-medium">Cuisine:</span> {recipe.cuisineType}
                  </p>
                  <p className="text-gray-600 mb-4">
                    <span className="font-medium">Cooking Time:</span> {recipe.cookingTime} minutes
                  </p>
                  <div className="flex justify-between items-center">
                    <Link
                      to={`/recipes/${recipe._id}`}
                      className="text-indigo-600 hover:text-indigo-800 font-medium"
                    >
                      View Details
                    </Link>
                    <div className="space-x-4">
                      <Link
                        to={`/recipes/edit/${recipe._id}`}
                        className="text-blue-600 hover:text-blue-800"
                      >
                        Edit
                      </Link>
                      <button
                        onClick={() => handleDelete(recipe._id)}
                        className="text-red-600 hover:text-red-800"
                      >
                        Delete
                      </button>
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}

export default RecipeList; 