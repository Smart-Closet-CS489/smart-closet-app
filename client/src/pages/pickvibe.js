import './pickvibe.css';
import React, { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import { getWeather } from '../utils/weather-api'

function PickVibe() {
	const [selectedVibe, setSelectedVibe] = useState("");
	const isComplete = selectedVibe;
	const [weather, setWeather] = useState(null);

	useEffect(() => {
	  async function fetchWeather() {
		try {
		  const data = await getWeather();
		  setWeather(data);
		} catch (err) {
		  console.error('Error fetching weather:', err);
		}
	  }
  
	  fetchWeather();
	}, []);

	if (!weather) return <div>Loading weather data...</div>;

	return (
		<div className="App-background">
			<div className="container">
				<div className="pickers">
					<div className="column1">
						<h3 className = "maintitle2">Vibe</h3>
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
						<h3 className = "maintitle2">Current Weather</h3>
						<h3> Temperature: {weather.temperature} </h3>
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
