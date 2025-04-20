import { Link } from "react-router-dom";
import React, { useState, useEffect } from 'react';
import './generatefit.css';
import { getImageUrlsByOutfitId } from '../utils/repository';
//import { generateOutfit, giveFeedback } from '../utils/coral-api';

function GenerateFit() {
	const [ratings, setRatings] = useState([1, 1, 1]);
	const labels = ["Color", "Weather", "Fit"];
    const [outerwearImage, setOuterwearImage] = useState('');
    const [topImage, setTopImage] = useState('');
    const [bottomImage, setBottomImage] = useState('');
    const [shoesImage, setShoesImage] = useState('');
    const [outfitId, setOutfitId] = useState(null);

	const handleRatingChange = (index, value) => {
		const updated = [...ratings];
		updated[index] = parseInt(value);
		setRatings(updated);
	};

    async function fetchImages(outfitId) {
        const images = await getImageUrlsByOutfitId(outfitId);
        console.log(images);
        setOuterwearImage(images.outerwear_img_url);
        setTopImage(images.top_img_url);
        setBottomImage(images.bottom_img_url);
        setShoesImage(images.shoes_img_url);
    }

    async function handleGenerateOutfit() {
        // if (outfitId != null) {
        //     await handleFeedback();
        // }
        // let outfitId = await generateOutfit();//put vibe here
        // setOutfitId(outfitId);
        // fetchImages(outfitId);
    }

    async function handleFeedback() {
       // await giveFeedback(outfitId, ratings);
    }

    useEffect(() => {
        handleGenerateOutfit();
    }, []);

    const images = getImageUrlsByOutfitId(8);

	return (
		<div className="App-background">
			<div className="max-w-3xl mx-auto p-4">
				<div className="image-grid">
					<img src={outerwearImage} alt="outerwear" className="image-item" />
					<img src={topImage} alt="top" className="image-item" />
					<img src={bottomImage} alt="bottom" className="image-item" />
					<img src={shoesImage} alt="shoes" className="image-item" />
				</div>

				<div className="lower-buttons">
					<div className="radio-group2 ">
						<button className="backbutton"
                                onClick={handleGenerateOutfit}>
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
