import './pickvibe.css';
import React from "react";
import { Link } from "react-router-dom";


function PickVibe() {

	return (
		<div>
			<div className="container">
				<div className="column1">
					<h3>Vibe</h3>
				</div>
				<div className="column2">
					<h3>Recency</h3>
				</div>
				<div className="column3">
					<h3>Current Weather</h3>
				</div>
			</div>
			<Link to="/"><button className="backbutton" type="backbutton">Back</button></Link>
		</div>

	);

}

export default PickVibe; 
