import { Link, useLocation} from "react-router-dom";
import React, { useState, useEffect } from 'react';
import './generatefit.css';
import { getOutfitById, getImageUrlsByOutfitId } from '../utils/repository';
import { generateOutfit, giveFeedback } from '../utils/coral-api';

function GenerateFit() {
	const [ratings, setRatings] = useState([1, 1, 1]);
	const labels = ["Color", "Weather", "Fit"];
	const [outerwearImage, setOuterwearImage] = useState('');
	const [topImage, setTopImage] = useState('');
	const [bottomImage, setBottomImage] = useState('');
	const [shoesImage, setShoesImage] = useState('');
	const [outfitId, setOutfitId] = useState(0);
	const location = useLocation();
	const vibeData = location.state;


	const handleRatingChange = (index, value) => {
		const updated = [...ratings];
		updated[index] = parseInt(value);
		setRatings(updated);
	};

	async function fetchImages() {
		const images = await getImageUrlsByOutfitId(outfitId);
		console.log(images);
        if (!images) {
            console.error("No images found for outfit ID:", outfitId);
            return;
        }
		setOuterwearImage(images.outerwear_img_url);
		setTopImage(images.top_img_url);
		setBottomImage(images.bottom_img_url);
		setShoesImage(images.shoes_img_url);
	}

	async function handleGenerateOutfit() {
		if (outfitId != 0) {
		    handleFeedback();
		}
        console.log("Generating outfit with vibe:", vibeData.vibe);
		 setOutfitId(await generateOutfit(vibeData.vibe));//put vibe here
         console.log("Generated outfit ID:", outfitId);
	}

	async function handleFeedback() {
		 await giveFeedback(outfitId, ratings);
	}

	useEffect(() => {
		handleGenerateOutfit();
	}, []);

    useEffect(() => {
		fetchImages()
	}, [outfitId]);

	return (
		<div className="App-background">
			<div className="max-w-3xl mx-auto p-4">
				<div className="image-grid">
					{/* <img src={outerwearImage} alt="outerwear" className="image-item" />
					<img src={topImage} alt="top" className="image-item" />
					<img src={bottomImage} alt="bottom" className="image-item" />
					<img src={shoesImage} alt="shoes" className="image-item" /> */}
					<div className="polaroid">
						<img src={outerwearImage}  alt="outerwear" className="image-item" />
						<div className="polaroid-label">Outerwear</div>
					</div>
					<div className="polaroid">
						<img src={topImage}  alt="top" className="image-item" />
						<div className="polaroid-label">Top</div>
					</div>
					<div className="polaroid">
						<img src={bottomImage}  alt="bottom" className="image-item" />
						<div className="polaroid-label">Bottoms</div>
					</div>
					<div className="polaroid">
						<img src={shoesImage} alt="shoes" className="image-item" />
						<div className="polaroid-label">Shoes</div>
					</div>
				</div>

				<div className="lower-buttons">
					<div className="radio-group2 ">
						<button className="backbutton"
							onClick={handleGenerateOutfit}>
							Regenerate
						</button>

						<div className="select-row">
							{["Weather", "Color", "Style"].map((label, i) => (
								<div key={i} className="select-group">
									<label className="select-label">{label}</label>
									<select
										className="rating-select"
										value={ratings[i]}
										onChange={(e) => handleRatingChange(i, e.target.value)}
									>
										{[1, 2, 3, 4, 5].map((num) => (
											<option key={num} value={num}>{num}</option>
										))}
									</select>
								</div>
							))}
						</div>

						<Link to="/">
							<button className="backbutton"
								onClick={handleFeedback}>
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
