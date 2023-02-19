import { useState, useEffect } from "react";
import axios from "axios";

export default function Page2({songs}) {
    console.log(songs);
    return (<div className="flex flex-col items-center bg-spotify-darkgray h-screen">
        <div className="sticky top-0 w-screen z-100 text-center p-6 text-4xl bg-black text-white font-bold drop-shadow-spotify-green drop-shadow-lg mb-8">
            Splinify
        </div>
    </div>);
}