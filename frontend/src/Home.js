import { useState } from "react";
import Songcard from "./Songcard";

export default function Home() {
    const [songCards, setSongsCards] = useState([(<Songcard/>), (<Songcard/>)]);
    return (<div className="flex flex-col items-center bg-spotify-darkgray h-screen">
        <div className="sticky top-0 w-screen z-100 text-center p-6 text-4xl bg-black text-white font-bold drop-shadow-spotify-green drop-shadow-lg mb-8">
            Splinify
        </div>
        {songCards}
        <AddSong/>
    </div>);

    function onAddSong() {
        let newSongCards = [...songCards];
        newSongCards.push(<Songcard/>);
        setSongsCards(newSongCards);
    }
    function AddSong() {
        return (
            <div>
                <button onClick={() => onAddSong()} className="text-white font-bold text-4xl">
                    +
                </button>
            </div>
        )
    }
}