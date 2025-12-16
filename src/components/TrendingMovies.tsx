import React, {useEffect, useState} from "react";
import Spinner from "./Spinner";

import { getTrendingMovies } from '../appwrite';

const TrendingMovies = () => {
    const [loadingTrendingVideo, setLoadingTrendingVideo] = useState(false);
    const [trendingErrorMessage, setTrendingErrorMessage] = useState('');
    const [trendingMovies, setTrendingMovies]:any = useState([]);

    const loadTrendingMovies = async () => {
        setLoadingTrendingVideo(true);
        setTrendingErrorMessage('')
        try {
            const movies = await getTrendingMovies();
            setTrendingMovies(movies);
        } catch (error) {
            console.error(`Error fetching trending movies: ${error}`)
            setTrendingErrorMessage(`Error fetching trending movies: ${error}`)
        } finally {
            setLoadingTrendingVideo(false)
        }
    }

    useEffect(() => {
        loadTrendingMovies();
    }, [])
    
    return (    
        <>
            { trendingMovies.length > 0 && (
                <section className='trending'>
                    <h2>Trending Movies</h2>
                    {
                        loadingTrendingVideo ? <Spinner/>
                        : trendingErrorMessage 
                            ? ( <p className="py-8 text-center text-red-500">{trendingErrorMessage}</p>) 
                            :   <ul>
                                    {trendingMovies.map((movie:any, index:any) => (
                                        <li key={movie.$id}>
                                            <p>{index + 1 }</p>
                                            <img src={movie.poster_url} alt={movie.title} />
                                        </li>
                                    ))}
                                </ul>
                    }
                    
                </section>
            )}
        </>
    )
};

export default TrendingMovies;
