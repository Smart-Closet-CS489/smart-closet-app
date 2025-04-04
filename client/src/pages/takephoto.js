import React from "react";
import { Link } from "react-router-dom";
import './takephoto.css';


function TakePhoto() {

	return (
		<div className="entirepage">
			<div className="stream">
				<img src="snoop.jpg"></img>
			</div>
			<div className="camerabuttons">
				<button className="camerabutton" type="button">Take Photo</button>
				<button className="camerabutton" type="button">Save</button>
			</div>

			<Link to="/catalog">
				<button className="backPhoto" type="button">Back</button>
			</Link>
		</div>
	);
}

// http://0.0.0.0:7123/stream.mjpg"/>
export default TakePhoto;

