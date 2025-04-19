import { Link } from "react-router-dom";
import React, { useState } from 'react';
import './generatefit.css';

function GenerateFit() {
	const [ratings, setRatings] = useState([1, 1, 1]);
	const labels = ["Color", "Weather", "Fit"];

	const handleRatingChange = (index, value) => {
		const updated = [...ratings];
		updated[index] = parseInt(value);
		setRatings(updated);
	};

	return (
		<div className="App-background">
			<div className="max-w-3xl mx-auto p-4">
				<div className="image-grid">
					<img src="/snoop.jpg" alt="outerwear" className="image-item" />
					<img src="/snoop.jpg" alt="top" className="image-item" />
					<img src="/snoop.jpg" alt="bottom" className="image-item" />
					<img src="/snoop.jpg" alt="shoes" className="image-item" />
				</div>

				<div className="lower-buttons">
					<div className="radio-group2 ">
						<button className="backbutton">
							Regenerate
						</button>

						<div className="flex gap-4">
							{ratings.map((rating, i) => (
								<select
									key={i}
									className="border rounded px-2 py-1"
									value={rating}
									onChange={(e) => handleRatingChange(i, e.target.value)}
								>
									{[1, 2, 3, 4, 5].map((num) => (
										<option key={num} value={num}>{num}</option>
									))}
								</select>
							))}
						</div>

						<Link to="/">
							<button className="backbutton">
								I love it!
							</button>
						</Link>
					</div>
				</div>
			</div>
		</div>

	);
}

export default GenerateFit; 
