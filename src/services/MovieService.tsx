const API_BASE_URL = import.meta.env.VITE_TMDB_API_URL;
const API_KEY = import.meta.env.VITE_TMDB_API_KEY;


const _fetchMovies = async (query = '') => {
    let endpoint = query 
        ? `${API_BASE_URL}/search/movie?query=${encodeURIComponent(query)}`
        : `${API_BASE_URL}/discover/movie?sort_by=popularity.desc`;

    endpoint = `${endpoint}&api_key=${API_KEY}`

    const response = await fetch(endpoint);
        
    if(!response.ok) {
        throw new Error('Failed to fetch movies')
    }

    return await response.json();
}


export default _fetchMovies;
