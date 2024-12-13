import { Link, useNavigate } from 'react-router-dom';

function Navbar() {
  const navigate = useNavigate();

  const handleLogout = () => {
    localStorage.removeItem('token');
    navigate('/login');
  };

  return (
    <nav className="bg-white shadow-lg">
      <div className="max-w-7xl mx-auto px-4">
        <div className="flex justify-between h-16">
          <div className="flex items-center">
            <Link to="/recipes" className="flex-shrink-0 flex items-center">
              <span className="text-2xl font-bold text-indigo-600">RecipeHub</span>
            </Link>
            <div className="hidden md:ml-6 md:flex md:space-x-8">
              <Link
                to="/recipes"
                className="text-gray-700 hover:text-indigo-600 px-3 py-2 rounded-md font-medium"
              >
                Recipes
              </Link>
              <Link
                to="/add-recipe"
                className="text-gray-700 hover:text-indigo-600 px-3 py-2 rounded-md font-medium"
              >
                Add Recipe
              </Link>
            </div>
          </div>
          <div className="flex items-center">
            <button
              onClick={handleLogout}
              className="text-gray-700 hover:text-indigo-600 px-3 py-2 rounded-md font-medium"
            >
              Logout
            </button>
          </div>
        </div>
      </div>
    </nav>
  );
}

export default Navbar; 