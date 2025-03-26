import React, { useState } from "react";
import './catalog.css';
import { Link } from "react-router-dom";

function Catalog() {
  const [selectedOption, setSelectedOption] = useState("");

  return (
    <div>
      <div className="container">
        <div className="column1">
          <h3>Type</h3>
          <form className="radio-group">
            <label>
              <input
                type="radio"
                name="typeoptions"
                value="Top"
                id="Top"
                checked={selectedOption === "Top"}
                onChange={(e) => setSelectedOption(e.target.value)}
              />
              <label htmlFor="Top">Top</label>
            </label>
            <label>
              <input
                type="radio"
                name="typeoptions"
                value="Outerwear"
                id="Outerwear"
                checked={selectedOption === "Outerwear"}
                onChange={(e) => setSelectedOption(e.target.value)}
              />
              <label htmlFor="Outerwear">Outerwear</label>
            </label>
            <label>
              <input
                type="radio"
                name="typeoptions"
                value="Bottoms"
                id="Bottoms"
                checked={selectedOption === "Bottoms"}
                onChange={(e) => setSelectedOption(e.target.value)}
              />
              <label htmlFor="Bottoms">Bottoms</label>
            </label>
            <label>
              <input
                type="radio"
                name="typeoptions"
                value="Shoes"
                id="Shoes"
                checked={selectedOption === "Shoes"}
                onChange={(e) => setSelectedOption(e.target.value)}
              />
              <label htmlFor="Shoes">Shoes</label>
            </label>

          </form>
        </div>
        <div className="column2">
          <h3>Style</h3>
        </div>
        <div className="column3">
          <h3>Color</h3>
        </div>
      </div>
      <Link to="/"><button type="button">Back</button></Link>
    </div>
  );

}

export default Catalog;

