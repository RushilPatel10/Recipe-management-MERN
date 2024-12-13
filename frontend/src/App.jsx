import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import { ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import Login from './components/Login';
import Register from './components/Register';
import RecipeList from './components/RecipeList';
import RecipeForm from './components/RecipeForm';
import RecipeDetail from './components/RecipeDetail';
import PrivateRoute from './components/PrivateRoute';

function App() {
  return (
    <Router>
      <ToastContainer />
      <Routes>
        <Route path="/login" element={<Login />} />
        <Route path="/register" element={<Register />} />
        <Route path="/" element={<PrivateRoute><RecipeList /></PrivateRoute>} />
        <Route path="/recipes" element={<PrivateRoute><RecipeList /></PrivateRoute>} />
        <Route path="/recipes/new" element={<PrivateRoute><RecipeForm /></PrivateRoute>} />
        <Route path="/recipes/edit/:id" element={<PrivateRoute><RecipeForm /></PrivateRoute>} />
        <Route path="/recipes/:id" element={<PrivateRoute><RecipeDetail /></PrivateRoute>} />
      </Routes>
    </Router>
  );
}

export default App;
