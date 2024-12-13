import { Link, useNavigate } from 'react-router-dom';
import { toast } from 'react-toastify';

function Navbar() {
  const navigate = useNavigate();

  const handleLogout = () => {
    localStorage.removeItem('token');
    toast.success('Logged out successfully');
    navigate('/login');
  };

  return (
    <nav className="bg-white shadow-custom">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between h-16">
          <div className="flex items-center">
            <Link to="/recipes" className="flex items-center">
              <span className="text-2xl font-bold text-primary-600">Recipe Hub</span>
            </Link>
          </div>

          <div className="flex items-center space-x-4">
            <Link
              to="/recipes"
              className="text-secondary-600 hover:text-secondary-900 px-3 py-2 rounded-md text-sm font-medium transition duration-150"
            >
              Recipes
            </Link>
            <Link
              to="/recipes/new"
              className="bg-primary-500 text-white hover:bg-primary-600 px-4 py-2 rounded-lg text-sm font-medium transition duration-150"
            >
              Add Recipe
            </Link>
            <button
              onClick={handleLogout}
              className="text-secondary-600 hover:text-secondary-900 px-3 py-2 rounded-md text-sm font-medium transition duration-150"
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