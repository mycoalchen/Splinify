import { useEffect, useState } from "react";
import axios from 'axios';

export default function Songcard() {

    useEffect(() => {
        var client_id = 'CLIENT_ID';
        var client_secret = 'CLIENT_SECRET';

        var authOptions = {
            url: 'https://accounts.spotify.com/api/token',
            headers: {
                'Authorization': 'Basic ' + (new Buffer(client_id + ':' + client_secret).toString('base64'))
            },
            form: {
                grant_type: 'client_credentials'
            },
            json: true
        };

        request.post(authOptions, function (error, response, body) {
            if (!error && response.statusCode === 200) {
                var token = body.access_token;
            }
        });
    });

    // 1 is input, 2 is searching, 3 is found
    const [type, setType] = useState(1);
    const [spotifyToken, setSpotifyToken] = useState("");
    const [title, setTitle] = useState("");
    // const [artist, setArtists] = useState("");

    const config = {
        headers: { 'Authorization': 'Bearer ' + token }
    }

    function handleFindSong() {
        axios.get(`https://api.spotify.com/v1/search?q=track%3A${title}&type=track`, config).then((value) => {
            console.log(value);
        })
    }

    return (<form className="text-white px-4 m-4 h-16 w-3/5 bg-black flex flex-row justify-between">
        <input type="text" name="Title" placeholder="Title" className="songCardInput"
            value={title} onChange={(e) => setTitle(e.target.value)} />
        <input type="button" value="Find song" onClick={() => handleFindSong()} className="bg-spotify-darkgray cursor-pointer" />
        {/* <input type="text" name="Artist" placeholder="Artist" className="songCardInput"/> */}
    </form>);
}