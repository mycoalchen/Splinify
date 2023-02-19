import { useState, useEffect } from "react";
import axios from "axios";
import Page2 from "./Page2";
import { Navigate, useNavigate } from "react-router-dom";

export default function Home() {

    const [spotifyToken, setSpotifyToken] = useState("");
    const [songCards, setSongsCards] = useState([]);
    const [trackIds, setTrackIds] = useState([]);
    const [results, setResults] = useState([]);
    const [resultsEmpty, setResultsEmpty] = useState(true);

    function getTrackIds() {
        return trackIds;
    }
    const [queryParams, setQueryParams] = useState({
        names: [],
        danceability: [],
        energy: [],
        valence: [],
        n: 6
    }
    );

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
                setSongsCards([]);
            });
    }, []);

    return (<>{
        resultsEmpty ?
            <div className="flex flex-col items-center bg-spotify-darkgray h-screen">
                <div className="sticky top-0 w-screen z-100 text-center p-6 text-4xl bg-black text-white font-bold drop-shadow-spotify-green drop-shadow-lg mb-8" >
                    Splinify
                </div >
                {songCards}
                < div className="flex flex-row space-x-2 items-between" >
                    <AddSong />
                </div >
                <Generate />
            </div >
            : <>
            <div className="w-screen h-screen bg-black text-white flex flex-col justify-center align-center text-center">
            <div className="sticky top-0 w-screen z-100 text-center p-6 text-4xl bg-black text-white font-bold drop-shadow-spotify-green drop-shadow-lg mb-8" >
                    Splinify
                </div >
                YOUR SONGS:
                    {results.map((result) => {
                        // axios.get(`https://api.spotify.com/v1/search?q=track%3A${result}&type=track`, { headers: { 'Authorization': 'Bearer ' + spotifyToken } }).then((value) => {
                        //     const newId = value.data.tracks.items[0].id;

                        //     _setTrackIds(newTrackIds);
                        // })
                        return(<div className="text-center">
                            {result}
                        </div>);
                    })}
            </div>
            </>
    }
    </>);

    function onAddSong() {
        let newSongCards = [...songCards];
        newSongCards.push(<Songcard configVal={{ 'Authorization': 'Bearer ' + spotifyToken }} _getTrackIds={getTrackIds} _setTrackIds={setTrackIds} />);
        setSongsCards(newSongCards);
    }
    function AddSong() {
        return (
            <div>
                <button onClick={() => onAddSong()} className="text-white font-bold text-4xl hover:scale-110">
                    +
                </button>
            </div>
        )
    }
    function onSubtractSong() {
        let newSongCards = [...songCards];
        newSongCards.pop(<Songcard />);
        setSongsCards(newSongCards);
    }
    function SubtractSong() {
        return (
            <div>
                <button onClick={() => onSubtractSong()} className="text-white font-bold text-4xl hover:scale-125 my-">
                    -
                </button>
            </div>
        )
    }
    async function OnGenerate() {
        let newQueryParams = {
            names: [],
            danceability: [],
            energy: [],
            valence: [],
            n: 5
        };
        for (let i = 0; i < trackIds.length; i++) {
            const trackId = trackIds[i];
            const configVal = { 'Authorization': 'Bearer ' + spotifyToken };
            const nameResponse = await axios.get(`https://api.spotify.com/v1/tracks/${trackId}`, { headers: configVal });
            const name = nameResponse.data.name;
            const features = await axios.get(`https://api.spotify.com/v1/audio-features/${trackId}`, { headers: configVal });
            newQueryParams.names.push(name);
            newQueryParams.danceability.push(features.data.danceability);
            newQueryParams.energy.push(features.data.energy);
            newQueryParams.valence.push(features.data.valence);
        }
        setQueryParams(newQueryParams);
        console.log("nqp:", newQueryParams);
        axios.post("http://127.0.0.1:5000/service", newQueryParams, {
            headers: {
                "Access-Control-Allow-Origin": "*"
            }
        }).then((response) => {
            setResults(response.data.playlist);
            setResultsEmpty(false);
        },);
    }

    function Generate() {
        return (
            <div>
                <button onClick={() => OnGenerate()} className="my-8 text-white font-bold bg-spotify-green px-2 py-3 text-3xl hover:scale-110 rounded-lg iterms-center">
                    Generate
                </button>
            </div>
        )
    }

    function Results({ songs }) {
        return (
            <div className="w-3/5 origin-[50%_50%] b-0 h-3/5 ml-50% mr-50vh bg-black absolute">
                ah
            </div>
        );
    }

    function Songcard({ configVal, _getTrackIds, _setTrackIds }) {
        const [type, setType] = useState(1);
        const [title, setTitle] = useState("");
        const [artist, setArtist] = useState("");

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

        function handleFindSong() {
            axios.get(`https://api.spotify.com/v1/search?q=track%3A${title}&type=track`, { headers: configVal }).then((value) => {
                setTitle(value.data.tracks.items[0].name);
                setArtist(value.data.tracks.items[0].artists[0].name);
                setType(2);
                let newTrackIds = [..._getTrackIds()];
                newTrackIds.push(value.data.tracks.items[0].id);
                _setTrackIds(newTrackIds);
            })
        }

        return (<form className="text-white m-4 h-16 w-3/5 bg-black flex flex-row justify-between rounded-lg" onSubmit={(e) => { e.preventDefault(); handleFindSong() }}>
            {type === 1 &&
                <input type="text" name="Title" placeholder="Title" className="songCardInput mx-4 px-2 w-full focus:outline-none"
                    value={title} onChange={(e) => setTitle(e.target.value)} />
            }
            {type === 2 &&
                <TitleArtistDrawer />
            }
            <div className="flex flex-row justify-end">
                <input type="button" value="Find Song" onClick={() => handleFindSong()} className="bg-spotify-green cursor-pointer my-2 px-2 rounded-lg hover:scale-110" />
            </div>
            {/* <input type="text" name="Artist" placeholder="Artist" className="songCardInput"/> */}
        </form>);
    }
}