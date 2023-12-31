import React, {useState, useEffect, useContext} from "react";
import ReviewForm from "../components/forms/ReviewForm";
import HLTB from "../components/HLTB";
import { useParams } from "react-router-dom";
import { UserContext } from "../context/UserContext";
import { format, parseISO } from 'date-fns';

function Game() {
    const [loading, setLoading] = useState(true)
    const [game, setGame] = useState([])
    const [userLists, setUserLists] = useState([])
    const [listSelection, setListSelection] = useState(0)
    const [reviewForm, setReviewForm] = useState(false)
    const [gameAdded, setGameAdded] = useState(false)
    const [error, setError] = useState()
    const [display, setDisplay] = useState(false)
    const {api_id} = useParams();
    const {user} = useContext(UserContext)

    useEffect(() => {
        fetch(`/games/${api_id}`)
        .then(r => {
            if (r.ok) {
                r.json().then((game) => setGame(game)).then(setLoading(false))
            }
        })
    }, [])

    useEffect(() => {
        fetch(`/user-lists/${user.id}`)
        .then((r) => {
            if (r.ok) {
                r.json().then((lists) => setUserLists(lists))
            }
        })
    }, [])


    if (!game) {
        return <p className="pt-5">Loading...</p>
    }

    let game_developers
    if (game.developers) {
        game_developers = game.developers.map((developer) => developer.name).join(', ')
    }
    
    let game_genres
    if (game.genres) {
        game_genres = game.genres.map((genre) => genre.name).join(', ')
    }
    
    let game_platforms
    if (game.platforms) {
        game_platforms = game.platforms.map((platform) => platform.platform.name).join(', ')
        }
    
    let game_publishers
    if (game.publishers) {
        game_publishers = game.publishers.map((publisher) => publisher.name).join(', ')
        }

    function capitalizeFirstLetter(string) {
        return string.charAt(0).toUpperCase() + string.slice(1);
    }

    let game_tags
    if (game.tags) {
        game_tags = game.tags.map((tag) => capitalizeFirstLetter(tag.name)).join(', ')
        }
    
    let game_stores
    if (game.stores) {
        game_stores = game.stores.map((store) => store.store.name).join(', ')
        }

    let game_rating
    if (game.esrb_rating) {
        game_rating = game.esrb_rating.name
    }

    let game_description
    if (game.description) {
        game_description = game.description.replace(/\n/g, '<br />')
    }

    function handleCreateListItem(e) {
        e.preventDefault()

        const item_data = {
            api_id: game.id,
            name: game.name,
            image: game.background_image,
            user_id: user.id,
            list_id: parseInt(listSelection)
        }
        
        fetch("/create-gamelist-item", {
            method: "POST",
            headers: {
                "Content-Type": "application/json",
                "Accept": "application/json",
            },
            body: JSON.stringify(item_data),
        }).then((r) => {
            if (r.ok) {
                r.json().then(document.getElementById('addGameToListModal').close())
                .then(setGameAdded(true))
                .then(setTimeout(() => {
                    setGameAdded(false)
                }, 5000))
            } else {
                r.json().then(document.getElementById('addGameToListModal').close())
                .then((message) => setError(message['message']))
                .then(() => setDisplay(true)).then(setTimeout(() => {
                    setError('')
                    setDisplay(false)
                }, 8000))
            }
        })
    }


    const gamelist_options = userLists.map((list) => (
        <option key={list.id} value={list.id} name={list.name}>{list.name}</option>
    ))

    let formattedDate
    if (game.released) {
        const parsedDate = parseISO(game.released)
        formattedDate = format(parsedDate, 'MMM d, yyyy')
    }

    function writeReview() {
        setReviewForm(!reviewForm)
    }
            
    return (
        <>   
            {gameAdded ? 
            <div className="alert alert-success mt-5">
                <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" className="stroke-current shrink-0 w-6 h-6"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"></path></svg>
                <span>Game added to your list!</span>
            </div>
            :
            null}  

            {display ?
            <div className="alert alert-warning mt-5">
                <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" className="stroke-current shrink-0 w-6 h-6"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"></path></svg>
                <span>{error}</span>
            </div>
            : null}   

            <dialog id="addGameToListModal" className="modal">
                <div className="modal-box">
                    <h3 className="font-bold text-lg">Choose a list to add this game to!</h3>
                    <form className="flex justify-between" onSubmit={(e) => handleCreateListItem(e)}>
                        <select onChange={(e) => setListSelection(e.target.value)} className="select select-bordered w-full max-w-xs">
                            <option disabled selected>Select list:</option>
                            {gamelist_options}
                        </select>
                        <button type="submit" className="btn btn-primary">Add Game</button>
                    </form>
                        <p className="pt-4 text-xs">Press ESC key or click outside to close</p>
                </div>
                <form method="dialog" className="modal-backdrop">
                    <button>close</button>
                </form>
            </dialog>
            
            {loading ? <p>Loading...</p> : <>

            {/* image, game name, release date, esrb rating, add to list & review buttons */}
            <div className="card card-side bg-neutral-content shadow-xl">
                <figure><img className="w-96" src={game.background_image} alt={game.name}/></figure>
                <div className="card-body">
                    <h2 className="card-title text-4xl">{game.name}</h2>
                    <p>{formattedDate} | {game_rating} </p>
                    <div className="card-actions justify-end">
                        <button className="btn btn-primary" onClick={()=>document.getElementById('addGameToListModal').showModal()}>Add to List</button>
                        <button className="btn btn-primary" onClick={writeReview}>{reviewForm ? "Discard Review" : "Write a Review"}</button>
                    </div>
                </div>
            </div>

            {/* review form in a card */}
            {reviewForm ? <ReviewForm game={game} /> : null}

            {/* how long to beat information in a card */}
            <HLTB game={game.name} />
            
            {/* game description */}
            <div className="card bg-neutral-content shadow-xl">
                <div className="card-body">
                    <h2 className="card-title">About</h2>
                    <p dangerouslySetInnerHTML={{ __html: game_description }}></p>
                </div>
            </div>

            {/* other game details */}
            <div className="card bg-neutral-content shadow-xl">
                <div className="card-body">
                <div className="overflow-x-auto">
                    <h2 className="card-title"> More Details</h2>
                    <table className="table">
                        <tbody>
                        <tr>
                            <th>Developer(s)</th>
                            <td>{game_developers}</td>
                        </tr>
                        <tr>
                            <th>Platform(s)</th>
                            <td>{game_platforms}</td>
                        </tr>
                        <tr>
                            <th>Publisher(s)</th>
                            <td>{game_publishers}</td>
                        </tr>
                        <tr>
                            <th>Genre(s)</th>
                            <td>{game_genres}</td>
                        </tr>
                        <tr>
                            <th>Tag(s)</th>
                            <td>{game_tags}</td>
                        </tr>
                        <tr>
                            <th>Store(s)</th>
                            <td>{game_stores}</td>
                        </tr>
                        </tbody>
                    </table>
                    </div>
                </div>
            </div>
            </>}
        </>
    )
}

export default Game;