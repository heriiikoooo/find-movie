import React, { useState, useEffect } from 'react';
import { useDebounce } from 'react-use';

import Search from './components/Search';
import Spinner from './components/Spinner';
import MovieCard from './components/MovieCard';
import { getTrendingMovies, updateSearchCount } from './appwrite';

const API_BASE_URL = import.meta.env.VITE_TMDB_API_URL;
const API_KEY = import.meta.env.VITE_TMDB_API_KEY;

const API_OPTIONS = {
    method: 'GET',
    headers: {
        accepts: 'application/json',
        Authorization: `Bearer ${API_KEY}`
    }
}

const App = () => {
  const [searchTerm, setSearchTerm] = useState('');
  const [errorMessage, setErrorMessage] = useState('');
  const [movieList, setMovieList] = useState([]);
  const [isLoading, setIsLoading] = useState(false)
  const [debouncedSearchTerm, setDebouncedSearchTerm] = useState('');
  const [trendingMovies, setTrendingMovies] = useState([])

  //Debouce the search term to prevent making too many API request
  useDebounce( () => setDebouncedSearchTerm(searchTerm),500, [searchTerm]);

  const fetchMovies = async (query = '') => {
    console.log(query);
    setIsLoading(true);
    setErrorMessage('');
    try {

        let endpoint = query 
            ? `${API_BASE_URL}/search/movie?query=${encodeURIComponent(query)}`
            : `${API_BASE_URL}/discover/movie?sort_by=popularity.desc`;

        endpoint = `${endpoint}&api_key=${API_KEY}`

        const response = await fetch(endpoint);
        
        if(!response.ok) {
            throw new Error('Failed to fetch movies')
        }

        const data = await response.json();
        if(data.Response === 'False') {
            setMovieList([]);
            setErrorMessage(data.Error || 'Failed to fetch movies');
            return;
        }

        setMovieList(data.results || [])
        // updateSearchCount()
        if(query && data.results.length > 0) {
            await updateSearchCount(query, data.results[0])
        }

    } catch (error) {
        console.error(`Error fething movies: ${error}`)
        setErrorMessage(`Error fething movies: ${error}`)
    } finally {
        setIsLoading(false)
    }
  }

  const loadTrendingMovies = async () => {
    try {
        const movies = await getTrendingMovies();
        setTrendingMovies(movies);
    } catch (error) {
        console.error(`Error fetching trending movies: ${error}`)
    }
  }
   
  useEffect(() => {
    fetchMovies(debouncedSearchTerm)
  }, [debouncedSearchTerm]);

  useEffect(() => {
    loadTrendingMovies();
  }, [])

  return (
    <main>
        <div className="pattern">
            <div className="wrapper">
                <header>
                    <img src="./hero.png" alt="" />
                    <h1>Find <span className="text-gradient">Movies</span> You'll Enjoy Without the Hassle</h1>
                    <Search searchTerm={searchTerm} setSearchTerm={setSearchTerm} />
                </header>

                { trendingMovies.length > 0 && (
                    <section className='trending'>
                        <h2>Trending Movies</h2>
                        <ul>
                            {trendingMovies.map((movie:any, index:any) => (
                                <li key={movie.$id}>
                                    <p>{index + 1 }</p>
                                    <img src={movie.poster_url} alt={movie.title} />
                                </li>
                            ))}
                        </ul>
                    </section>
                )}

                <section className='all-movies'>
                    <h2 >All movies</h2>

                    {
                        isLoading 
                        ? ( <Spinner/> )
                        : errorMessage 
                            ? ( <p className="text-red-500">{errorMessage}</p>) 
                            :   <ul>
                                    {movieList.map((movie:any) => (
                                        <MovieCard key={movie.id} movie={movie}/>
                                    ))}
                                </ul>
                    }
                </section>
            </div>
        </div>
    </main>
  )
}

export default App