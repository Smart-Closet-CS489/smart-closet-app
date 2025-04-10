import React from "react";
import { Link } from "react-router-dom";
import './takephoto.css';
import { useState } from "react";

function TakePhoto() {
	const [isPhotoShown, setIsPhotoShown] = useState(false);

	const handleTakePhoto = () => {
		setIsPhotoShown(!isPhotoShown);
	};

	return (
		<div className="entirepage">
		                
			<img
				src={isPhotoShown ? "http://localhost:7123/photo.jpg" : "http://localhost:7123/stream.mjpg"}
				alt="Camera Stream"
			/> 
			<Link to="/catalog">
				<button className="backPhoto" type="button">Back</button>
			</Link>

			<div className="camerabuttons">
				<button className="camerabutton" type="button" onClick={handleTakePhoto}>
					{isPhotoShown ? "Retry" : "Take Photo!"}
				</button>
				<button className="camerabutton" type="button">Save</button>
			</div>
		</div>
	);
}

// http://0.0.0.0:7123/stream.mjpg"/>
export default TakePhoto;
