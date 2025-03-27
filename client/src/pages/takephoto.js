import React from "react";
import { Link } from "react-router-dom";


function TakePhoto() {

	return (
		<div>
			<p>Take a picture here!</p>
			<img src="http://0.0.0.0:7123/stream.mjpg" width="640" height="480" />
		</div>
	);

}

export default TakePhoto; 

