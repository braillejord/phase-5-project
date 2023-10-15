import React, {useState, useEffect} from "react";
import { useParams, useHistory } from "react-router-dom";
import GamePreview from "../components/previews/GamePreview";
import { NavLink } from "react-router-dom";

function List() {
    const [list, setList] = useState([])
    const [showDetails, setShowDetails] = useState(false)
    const [fetchData, setFetchData] = useState(false)
    const history = useHistory()

    const {id} = useParams();

    useEffect(() => {
        fetch(`/lists/${id}`)
        .then((r) => {
            if (r.ok) {
                r.json().then((list) => setList(list))
            }
        })
    }, [])

    function handleDeleteList() {
        fetch(`/lists/${id}`, {
            method: "DELETE"
        })
        .then(history.push("/"))
        .then(window.location.reload())
    }

    return (
        <>
            <h1>{list.name}</h1>
            <button className="btn" onClick={() => setShowDetails(!showDetails)}>{showDetails ? "Hide Details" : "Show Details"}</button>
            <button className="btn btn-primary"><NavLink to={"/search-games"}>Find a Game</NavLink></button>
            <button className="btn" onClick={()=>document.getElementById('deleteListModal').showModal()}>Delete List</button>
            {list.gamelist_items?.map((game) => (
                <GamePreview key={game.api_id} game={game} showDetails={showDetails} setShowDetails={setShowDetails}/>
            ))}

            <dialog id="deleteListModal" className="modal">
                <div className="modal-box">
                    <h3 className="font-bold text-lg">Are you sure you want to delete this list?</h3>
                    <button onClick={() => handleDeleteList()} type="submit" className="btn btn-primary">Delete List</button>
                    <p className="py-4">Press ESC key or click outside to close</p>
                </div>
                <form method="dialog" className="modal-backdrop">
                    <button>close</button>
                </form>
            </dialog>

        </>
    )
}

export default List;