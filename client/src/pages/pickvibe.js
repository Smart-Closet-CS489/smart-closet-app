import './pickvibe.css';
import React, { useState, useEffect } from "react";
import { Link } from "react-router-dom";

function PickVibe() {
	const [selectedVibe, setSelectedVibe] = useState("");
	const isComplete = selectedVibe;

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
					<div className="column3">
						<h3>Current Weather</h3>
					</div>
				</div>
			</div>
			<div className="button-container">
				<Link to="/">
					<button className="backbutton" type="button">Back</button>
				</Link>

				{/* generate fit button */}
				<Link to={isComplete ? "/generatefit" : "#"} onClick={(e) => !isComplete && e.preventDefault()}>
					<button className={`photobutton ${isComplete ? "enabled" : "disabled"}`} type="button" disabled={!isComplete}>
						Generate Outfit
					</button>
				</Link>
			</div>
		</div>

	);

}

export default PickVibe; 
