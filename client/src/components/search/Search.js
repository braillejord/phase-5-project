import React, {useState} from "react";
import AllGames from "./AllGames";
import AllReviews from "./AllReviews";

function Search() {    
    const [searchGames, setSearchGames] = useState(false)

    return (
        <>
            <h1>Search</h1>
            <button onClick={() => setSearchGames(!searchGames)}>{searchGames ? "Search Reviews" : "Search Games"}</button>
            {searchGames
            ?
            <AllGames />
            :
            <AllReviews />
            }
        </>
    )
}

export default Search;