import React, { useEffect, useState } from 'react';
import axios from 'axios';
import "./Video.css";

const Video = (props) => {
    const videoId = props.match.params.videoId
    const [video, setVideo] = useState(null)

    const getVideo = async () => {
        const video = await axios.post('/video/getVideo', { videoId });
        setVideo(video.data.video);
    }
    
    useEffect(() => {
        getVideo();
    }, [])
    

    if (video && video._id) {
        return (
            <div className="video-container">
                <video src={`http://localhost:5000/${video.filePath}`} controls></video>
                <div className="box-footer">
                    <div className="box-title">{video.title}</div>
                    <div>{video.description}</div>
                </div>
            </div>
        )
    } else {
        return null;
    }

}

export default Video;