import './pickvibe.css';
import React, { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import { getWeather } from '../utils/weather-api'
import { getInferenceSampleByVibe } from '../utils/repository';

function PickVibe() {
	const [selectedVibe, setSelectedVibe] = useState("");
	const isComplete = selectedVibe;
	const [weather, setWeather] = useState(null);

	useEffect(() => {
		async function fetchWeather() {
			try {
				console.log('weather data:');
				const data = await getWeather();
				console.log('weather data:', data);
				setWeather(data);

			} catch (err) {
				console.error('Error fetching weather:', err);
			}
		}

		fetchWeather();
	}, []);

	console.log("getWeather is:", getWeather);

	// show blank screen while api is loading
	if (!weather) return <div><div className="App-background"> </div></div>;

	return (
		<div className="App-background">
			<div className="container">
				<div className="pickers">
					<div className="column1">
						<h3 className="maintitle2">Vibe</h3>
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
						<h3 className="maintitle2">Current Weather</h3>
						<img src="weather_icons/sun.png" alt="weather icon" className="image-item2" />
						<h3> {weather.temperature}° </h3>
					</div>
				</div>
			</div>
			<div className="button-container">
				<Link to="/">
					<button className="backbutton" type="button">Back</button>
				</Link>

				{/* generate fit button */}
				<Link to={isComplete ? "/generatefit" : "#"} onClick={() => {
					if (isComplete) {
						getInferenceSampleByVibe(selectedVibe.trim()); // remove leading space
					}
				}}>
					<button className={`photobutton ${isComplete ? "enabled" : "disabled"}`} type="button" disabled={!isComplete}>
						Generate Outfit
					</button>
				</Link>
			</div>
		</div>

	);

}

export default PickVibe; 
