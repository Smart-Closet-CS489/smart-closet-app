import React from "react";
import { Link, useLocation} from "react-router-dom";
import './takephoto.css';
import { useEffect, useState } from "react";
import { createClothingArticle } from '../utils/repository';

function TakePhoto() {
	const [isPhotoShown, setIsPhotoShown] = useState(false);
	const location = useLocation();
	const clothingData = location.state;
  
	const handleTakePhoto = () => {
		setIsPhotoShown(!isPhotoShown);
	};

	const handleSave = async () => {
	  if (!clothingData) {
		console.error("No clothing data found!");
		return;
	  }
  
	  const hex = clothingData.color.replace("#", "");
	  const R = parseInt(hex.substring(0, 2), 16);
	  const G = parseInt(hex.substring(2, 4), 16);
	  const B = parseInt(hex.substring(4, 6), 16);
  
	  const clothingJson = {
		category: clothingData.type.trim().toLowerCase(),
		style: clothingData.style.trim().toLowerCase(),
		vibes: clothingData.vibes,
		color: { R, G, B }
	  };
  
	  try {
		await createClothingArticle(clothingJson);
		console.log("Clothing article saved!");
	  } catch (err) {
		console.error("Error saving clothing article:", err);
	  }
	};
  

	useEffect(() => {
		const url = isPhotoShown
			? "http://localhost:7123/set-isstreaming-false"
			: "http://localhost:7123/set-isstreaming-true";

		fetch(url)
			.catch((error) => {
				console.error("Error:", error);
			});
	}, [isPhotoShown]);

    useEffect(() => {
		fetch("http://localhost:7123/set-isstreaming-true")
			.catch((error) => {
				console.error("Error:", error);
			});
	}, []);

	return (
		<div className="App-background">
			<div className="entirepage">

				<img
					src={"http://localhost:7123/stream.mjpg"}
					alt="Camera Stream"
				/>

				<div className="camerabuttons">
					<button className="camerabutton" type="button" onClick={handleTakePhoto}>
						{isPhotoShown ? "Retry" : "Take Photo"}
					</button>
					<Link to="/">
						<button className="camerabutton" onClick={handleSave} type="button">Save</button>
					</Link>
				</div>
			</div>
		</div>
	);
}

// http://0.0.0.0:7123/stream.mjpg"/>i
// 	<Link to="/catalog">
//<button className="backPhoto" type="button">Back</button>
// </Link>
export default TakePhoto;
//src={isPhotoShown ? "http://localhost:7123/photo.jpg" : "http://localhost:7123/stream.mjpg"}

