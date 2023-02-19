import { useState } from "react";

export default function Songcard() {
    // 1 is input, 2 is searching, 3 is found
    const [type, setType] = useState(1);
    const [title, setTitle] = useState("");
    // const [artist, setArtists] = useState("");

    return (<div className="text-white m-4 h-16 w-3/5 bg-black flex flex-row justify-between">
        <input type="text" name="Title" placeholder="Title" className="songCardInput"/>
        {/* <input type="text" name="Artist" placeholder="Artist" className="songCardInput"/> */}
    </div>);
}