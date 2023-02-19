import { useEffect, useState } from "react";
import axios from 'axios';


export default function Songcard() {
    const [type, setType] = useState(1);
    const [spotifyToken, setSpotifyToken] = useState("");
    const [title, setTitle] = useState("");
    const [artist, setArtist] = useState("");
    const [trackId, setTrackId] = useState("");

    function TitleArtistDrawer() {
        if (type === 2) {
            return <div className="my-auto">
                <div className="songCardInput mx-4 px-2 my-auto w-full">
                    {title} | {artist}
                </div>
                {/* <input type="text" name="Artist" placeholder="Artist" className="songCardInput"/> */}
            </div>;
        } else return <></>;
    }

    const serialize = function (obj) {
        var str = [];
        for (var p in obj) {
            if (obj.hasOwnProperty(p)) {
                str.push(encodeURIComponent(p) + "=" + encodeURIComponent(obj[p]));
            }
        }
        return str.join("&");
    }
    useEffect(() => {
        var client_id = process.env.REACT_APP_CLIENT_ID;
        var client_secret = process.env.REACT_APP_CLIENT_SECRET;

        axios.defaults.baseURL = '';
        axios.post('https://accounts.spotify.com/api/token',
            serialize({
                grant_type: 'client_credentials'
            }),
            {
                headers: {
                    'Authorization': 'Basic ' + btoa(client_id + ':' + client_secret),
                    'Content-Type': 'application/x-www-form-urlencoded'
                },
                json: true,

            }, function (error, response, body) {
                if (!error && response.statusCode === 200) {
                    setSpotifyToken(body.access_token);
                }
            }).then((response) => {
                setSpotifyToken(response.data.access_token);
            });
    }, []);

    const config = {
        headers: { 'Authorization': 'Bearer ' + spotifyToken }
    }

    function handleFindSong() {
        axios.get(`https://api.spotify.com/v1/search?q=track%3A${title}&type=track`, config).then((value) => {
            setTrackId(value.data.tracks.items[0].id);
            setTitle(value.data.tracks.items[0].name);
            setArtist(value.data.tracks.items[0].artists[0].name);
            setType(2);
        })
    }

    return (<form className="text-white m-4 h-16 w-3/5 bg-black flex flex-row justify-between rounded-lg" onSubmit={(e) => {e.preventDefault(); handleFindSong()}}>
        {type === 1 &&
        <input type="text" name="Title" placeholder="Title" className="songCardInput mx-4 px-2 w-full focus:outline-none"
            value={title} onChange={(e) => setTitle(e.target.value)} />
        }
        {type === 2 &&
        <TitleArtistDrawer/>
        }
        <div className="flex flex-row justify-end">
            <input type="button" value="Find song" onClick={() => handleFindSong()} className="bg-spotify-green cursor-pointer my-2 px-2 rounded-lg" />
        </div>
        {/* <input type="text" name="Artist" placeholder="Artist" className="songCardInput"/> */}
    </form>);
}