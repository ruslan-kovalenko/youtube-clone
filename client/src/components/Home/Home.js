import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom'
import axios from 'axios';
import "./Home.css";

const Home = () => {
    const [videos, setVideos] = useState([])

    const getVideos = async () => {
        const videosList = await axios.get('/video/getVideos');
        setVideos(videosList.data.videos);
    }
    
    useEffect(() => {
        getVideos();
    }, [])
    
    const cards = videos.map((video, index) => {
        const minutes = Math.floor(video.duration / 60);
        const seconds = Math.floor(video.duration - minutes * 60);
        
        return (
            <div className="box" key={index}>
                <div className="box-header">
                    <Link to={{pathname: `/home/${video._id}`}}>
                        <img alt="thumbnail" src={`http://localhost:5000/${video.thumbnail}`} />
                        <div className="duration">
                            <span>{minutes} : {seconds}</span>
                        </div>
                    </Link>
                </div>
                <div className="box-footer">
                    <div className="box-title">{video.title}</div>
                    <div>{video.description}</div>
                </div>
            </div>
        )
    })
    
    return (
        <React.Fragment>
            <div className="home-header">
                <p className="title">
                    Videos
                </p>
            </div>
            <div className="container">
                <div className="content">
                    {cards}
                </div>
            </div>
        </React.Fragment>
    )
}

export default Home;