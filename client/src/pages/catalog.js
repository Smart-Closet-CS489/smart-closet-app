import React, { useState } from "react";
import './catalog.css';
import { Link } from "react-router-dom";
import { SketchPicker } from "react-color";

function Catalog() {
  const [selectedType, setSelectedType] = useState("");
  const [selectedStyle, setSelectedStyle] = useState("");
  const [color, setColor] = useState("");

  return (
    <div>
      <div className="container">
        {/* Column 1: Type Selection */}
        <div className="column1">
          <h3>Type</h3>
          <form className="radio-group">
            {["Top", "Outerwear", "Bottoms", "Shoes"].map((type) => (
              <label key={type}>
                <input
                  type="radio"
                  name="typeoptions"
                  value={type}
                  checked={selectedType === type}
                  onChange={(e) => {
                    setSelectedType(e.target.value);
                    setSelectedStyle(""); // Reset style selection when type changes
                  }}
                />
                {type}
              </label>
            ))}
          </form>
        </div>

        {/* Column 2: Style Selection (Appears Dynamically) */}
        <div className="column2">
          <h3>Style</h3>
          {selectedType === "Top" && (
            <form className="radio-group">
              {["T-shirt", "Long Sleeve", "Collared shirt", "Tank Top", "Crop Top"].map((style) => (
                <label key={style}>
                  <input
                    type="radio"
                    name="styleoptions"
                    value={style}
                    checked={selectedStyle === style}
                    onChange={(e) => setSelectedStyle(e.target.value)}
                  />
                  {style}
                </label>
              ))}
            </form>
          )}

          {selectedType === "Outerwear" && (
            <form className="radio-group">
              {["Sweatshirt", "Sweater", "Jacket", "Coat", "Cardigan"].map((style) => (
                <label key={style}>
                  <input
                    type="radio"
                    name="styleoptions"
                    value={style}
                    checked={selectedStyle === style}
                    onChange={(e) => setSelectedStyle(e.target.value)}
                  />
                  {style}
                </label>
              ))}
            </form>
          )}

          {selectedType === "Bottoms" && (
            <form className="radio-group">
              {["Pants", "Shorts", "Skirt", "Leggings"].map((style) => (
                <label key={style}>
                  <input
                    type="radio"
                    name="styleoptions"
                    value={style}
                    checked={selectedStyle === style}
                    onChange={(e) => setSelectedStyle(e.target.value)}
                  />
                  {style}
                </label>
              ))}
            </form>
          )}

          {selectedType === "Shoes" && (
            <form className="radio-group">
              {["Sneakers", "Running", "Open-toe", "Heels", "Boots"].map((style) => (
                <label key={style}>
                  <input
                    type="radio"
                    name="styleoptions"
                    value={style}
                    checked={selectedStyle === style}
                    onChange={(e) => setSelectedStyle(e.target.value)}
                  />
                  {style}
                </label>
              ))}
            </form>
          )}
        </div>

        {/* Column 3: Color Selection */}
        <div className="column3">
          <h3>Color</h3>
          <SketchPicker
            color={color}
            onChange={(updatedColor) => setColor(updatedColor.hex)}
            disableAlpha={true} // No transparency option!!
          />
        </div>
      </div>

      <Link to="/">
        <button className="backbutton" type="button">Back</button>
      </Link>
    </div>
  );
}

export default Catalog;
