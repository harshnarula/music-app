import React, { useState, useEffect, useRef } from "react";
import { songs as initialSongs } from "../data.js";
import { MdSkipPrevious } from "react-icons/md";
import { FaPause, FaPlay } from "react-icons/fa";
import { RiSkipForwardMiniFill } from "react-icons/ri";

export default function List() {
    const [searchTerm, setSearchTerm] = useState("");
    const [filter, setFilter] = useState("all");
    const [filteredSongs, setFilteredSongs] = useState(initialSongs);
    const [currentPage, setCurrentPage] = useState(1);
    const [currentSongIndex, setCurrentSongIndex] = useState(null);
    const [isPlaying, setIsPlaying] = useState(false);
    const [playingSong, setPlayingSong] = useState(null);
    const audioRef = useRef(null);
    const songsPerPage = 10;

    useEffect(() => {
        let tempSongs = [...initialSongs];

        if (searchTerm) {
            tempSongs = tempSongs.filter(song =>
                song.song_name.toLowerCase().includes(searchTerm.toLowerCase())
            );
        }

        if (filter === "likes") {
            tempSongs = tempSongs.sort((a, b) => b.likes - a.likes);
        } else if (filter === "artist") {
            tempSongs = tempSongs.sort((a, b) => a.artist.localeCompare(b.artist));
        } else if (filter === "rating") {
            tempSongs = tempSongs.filter(song => song.rating === 3);
        }

        setFilteredSongs(tempSongs);
        setCurrentPage(1); 
    }, [searchTerm, filter]);

    const indexOfLastSong = currentPage * songsPerPage;
    const indexOfFirstSong = indexOfLastSong - songsPerPage;
    const currentSongs = filteredSongs.slice(indexOfFirstSong, indexOfLastSong);

    const handlePageChange = (pageNumber) => {
        setCurrentPage(pageNumber);
    };

    const handleNextPage = () => {
        if (currentPage < pageNumbers.length) {
            setCurrentPage(currentPage + 1);
        }
    };

    const handlePrevPage = () => {
        if (currentPage > 1) {
            setCurrentPage(currentPage - 1);
        }
    };

    const pageNumbers = [];
    for (let i = 1; i <= Math.ceil(filteredSongs.length / songsPerPage); i++) {
        pageNumbers.push(i);
    }

    const handlePlayPause = (song) => {
        if (playingSong && playingSong.id === song.id) {
            if (isPlaying) {
                audioRef.current.pause();
                setIsPlaying(false);
            } else {
                audioRef.current.play();
                setIsPlaying(true);
            }
        } else {
            setPlayingSong(song);
            setIsPlaying(true);
            audioRef.current.src = song.song_url;
            audioRef.current.play();
        }
    };

    const handleNextSong = () => {
        if (currentSongIndex < filteredSongs.length - 1) {
            const nextIndex = currentSongIndex + 1;
            setCurrentSongIndex(nextIndex);
            setPlayingSong(filteredSongs[nextIndex]);
            setIsPlaying(true); 
        }
    };


    const handlePrevSong = () => {
        if (currentSongIndex > 0) {
            const prevIndex = currentSongIndex - 1;
            setCurrentSongIndex(prevIndex);
            setPlayingSong(filteredSongs[prevIndex]);
            setIsPlaying(true);
        }
    };


    const currentSong = playingSong || {};
    const currentSongSrc = currentSong.song_url || ""; 
    useEffect(() => {
        if (audioRef.current) {
            audioRef.current.src = currentSongSrc;
            if (isPlaying) {
                audioRef.current.play();
            } else {
                audioRef.current.pause();
            }
        }
    }, [currentSongSrc, isPlaying]);

    useEffect(() => {
        const handleEnded = () => {
            handleNextSong();
        };

        const audio = audioRef.current;
        if (audio) {
            audio.addEventListener('ended', handleEnded);
        }

        return () => {
            if (audio) {
                audio.removeEventListener('ended', handleEnded);
            }
        };
    }, [handleNextSong]);

    return (
        <div className="flex flex-col justify-center items-center w-screen h-auto space-y-4 p-4">
            <div className="flex flex-col bg-gray-700 justify-around indent-2 items-center w-[300px] h-[200px] text-white rounded-[8px] border-2 border-white m-[10px]">
                <p className="text-center text-xl bg-gray-700">{currentSong.song_name || "Select a song to play"}</p>
                <div className="flex flex-row my-[4px] space-x-2 ">
                    <button onClick={handlePrevSong} disabled={currentSongIndex === 0} className="text-white text-xl bg-gray-700">
                        <MdSkipPrevious />
                    </button>
                    <button onClick={() => handlePlayPause(playingSong)} className="text-white text-xl bg-gray-700 ">
                        {isPlaying ? <FaPause className = "scale-90" /> : <FaPlay className = "scale-90" />}
                    </button>
                    <button onClick={handleNextSong} disabled={currentSongIndex === filteredSongs.length - 1} className="text-white text-xl bg-gray-700">
                        <RiSkipForwardMiniFill />
                    </button>
                </div>
            </div>
            
            
            <div className="flex flex-row justify-center items-center w-full space-x-2">
                <input
                    type="text"
                    placeholder="Search songs"
                    className="flex justify-center indent-2 items-center w-[200px] h-[40px] bg-gray-700 text-white rounded-[8px] border-2 border-white m-[10px]"
                    onChange={(e) => setSearchTerm(e.target.value)}
                />
                <select
                    className="flex justify-center items-center w-[150px] h-[40px] bg-gray-700 text-white rounded-[8px] border-2 border-white m-[10px]"
                    onChange={(e) => setFilter(e.target.value)}
                >
                    <option value="all">All</option>
                    <option value="likes">Most Likes</option>
                    <option value="artist">Artist</option>
                    <option value="rating">Avg Rating</option>
                </select>
            </div>

            <div className="flex flex-col justify-center items-center w-full max-w-3xl h-auto rounded-[8px] bg-gray-700 p-4">
                <div className="flex flex-row justify-between items-center my-[2px] w-full text-white">
                    <p className="flex-1 text-center">Song Name</p>
                    <p className="flex-1 text-center">Artist</p>
                    <p className="flex-1 text-center">Rating</p>
                    <p className="flex-1 text-center">Likes</p>
                </div>
                {currentSongs.map((song, index) => (
                    <div
                        key={song.id}
                        className="flex flex-row justify-between items-center my-[2px] w-full text-white bg-gray-800 p-2 rounded"
                        onClick={() => {
                            setCurrentSongIndex(index + indexOfFirstSong);
                            handlePlayPause(song);
                        }}
                    >
                        <p className="flex-1 text-center">{song.song_name}</p>
                        <p className="flex-1 text-center">{song.artist}</p>
                        <p className="flex-1 text-center">{song.rating}</p>
                        <p className="flex-1 text-center">{song.likes}</p>
                    </div>
                ))}
            </div>

            <div className="flex justify-center items-center space-x-2 mt-4">
                <button
                    onClick={handlePrevPage}
                    className={`px-4 py-2 rounded ${currentPage === 1 ? 'bg-gray-600 cursor-not-allowed' : 'bg-gray-700'} text-white`}
                    disabled={currentPage === 1}
                >
                    &lt; Previous
                </button>
                {pageNumbers.map(number => (
                    <button
                        key={number}
                        onClick={() => handlePageChange(number)}
                        className={`px-4 py-2 rounded ${currentPage === number ? 'bg-gray-800' : 'bg-gray-700'} text-white`}
                    >
                        {number}
                    </button>
                ))}
                <button
                    onClick={handleNextPage}
                    className={`px-4 py-2 rounded ${currentPage === pageNumbers.length ? 'bg-gray-600 cursor-not-allowed' : 'bg-gray-700'} text-white`}
                    disabled={currentPage === pageNumbers.length}
                >
                    Next &gt;
                </button>
            </div>

        
            <audio ref={audioRef} />
        </div>
    );
}
