import React, { useState } from 'react';

import Search from './components/Search';
import TrendingMovies from './components/TrendingMovies';

import _fetchMovies from './services/MovieService';
import Movies from './components/Movies';

const App = () => {
    const [searchTerm, setSearchTerm] = useState('');

    return (
        <main>
            <div className="pattern">
                <div className="wrapper">
                    <header>
                        <img src="./hero.png" alt="" />
                        <h1>Find <span className="text-gradient">Movies</span> You'll Enjoy Without the Hassle</h1>
                        <Search searchTerm={searchTerm} setSearchTerm={setSearchTerm} />
                    </header>

                    <TrendingMovies/>
                    <Movies searchTerm={searchTerm}/>
                </div>
            </div>
        </main>
    )
}

export default App