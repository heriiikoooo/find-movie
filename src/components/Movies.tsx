import React, { useEffect, useState } from "react";
import MovieCard from "./MovieCard";

import { updateSearchCount } from '../appwrite';
import _fetchMovies from '../services/MovieService';
import Spinner from "./Spinner";
import { useDebounce } from "react-use";

const Movies = ({searchTerm}: {searchTerm:string}) => {
    const [debouncedSearchTerm, setDebouncedSearchTerm] = useState('');

    const [isLoading, setIsLoading] = useState(false)
    const [errorMessage, setErrorMessage] = useState('');
    const [movieList, setMovieList] = useState([]);

    //Debouce the search term to prevent making too many API request
    useDebounce( () => setDebouncedSearchTerm(searchTerm),500, [searchTerm]);

    const fetchMovies = async (query = '') => {
        console.log(query);
        setIsLoading(true);
        setErrorMessage('');
        try {

            const data = await _fetchMovies(query);

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

    useEffect(() => {
        fetchMovies(debouncedSearchTerm)
    }, [debouncedSearchTerm]);
    
    return (
        <>
            <section className='all-movies'>
                <h2 >All movies</h2>

                {
                    isLoading 
                    ? <Spinner/> 
                    : errorMessage 
                        ?   ( <p className="py-8 text-center text-red-500">{errorMessage}</p>) 
                        :   <ul>
                                {movieList.map((movie:any) => (
                                    <MovieCard key={movie.id} movie={movie}/>
                                ))}
                            </ul>
                }
            </section>
        </>
    )
};

export default Movies;
