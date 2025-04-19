import React from "react";
import { Link } from "react-router-dom";
import './takephoto.css';
import { useEffect, useState } from "react";

function TakePhoto() {
	const [isPhotoShown, setIsPhotoShown] = useState(false);

	const handleTakePhoto = () => {
		setIsPhotoShown(!isPhotoShown);
	};

    useEffect(() => {
        const url = isPhotoShown
        ? "http://localhost:7123/set-isstreaming-false"
        : "http://localhost:7123/set-isstreaming-true";

        fetch(url)
            .catch((error) => {
                console.error("Error:", error);
            });
    }, [isPhotoShown]);

	return (
		<div className="entirepage">
		                
			<img  
                                src={"http://localhost:7123/stream.mjpg"}
		                alt="Camera Stream"
			/> 
		 

			<div className="camerabuttons">
				<button className="camerabutton" type="button" onClick={handleTakePhoto}>
					{isPhotoShown ? "Retry" : "Take Photo"}
				</button>
				<button className="camerabutton" type="button">Save</button>
			</div>
		</div>
	);
}

// http://0.0.0.0:7123/stream.mjpg"/>i
// 	<Link to="/catalog">
				//<button className="backPhoto" type="button">Back</button>
			// </Link>
export default TakePhoto;
//src={isPhotoShown ? "http://localhost:7123/photo.jpg" : "http://localhost:7123/stream.mjpg"}

