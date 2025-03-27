import './pickvibe.css';
import React, { useState, useEffect } from "react";
import { Link } from "react-router-dom";

function PickVibe() {
	const [selectedVibe, setSelectedVibe] = useState("");

	return (
		<div>
			<div className="container">
				<div className="pickers">
					<div className="column1">
						<h3>Vibe</h3>
						<form className="radio-group">
							{[" Party", " Casual", " Formal", " Gym"].map((type) => (
								<label key={type}>
									<input
										type="radio"
										name="typeoptions"
										value={type}
										checked={selectedVibe === type}
										onChange={(e) => {
											setSelectedVibe(e.target.value);
										}}
									/>
									{type}
								</label>
							))}
						</form>
					</div>
					<div className="column2">
						<h3>Recency</h3>
					</div>
					<div className="column3">
						<h3>Current Weather</h3>
					</div>
				</div>
			</div>
			<Link to="/"><button className="backbutton" type="backbutton">Back</button></Link>
		</div>

	);

}

export default PickVibe; 
