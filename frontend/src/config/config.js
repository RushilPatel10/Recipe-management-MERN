const config = {
  API_URL: import.meta.env.VITE_API_URL || 'https://recipe-management-mern-backend.onrender.com/api'
};

// Validate API URL format
if (!config.API_URL.startsWith('http')) {
  console.error('Invalid API_URL:', config.API_URL);
}

console.log('Using API URL:', config.API_URL);

export default config; 