import React, { useState, useEffect } from "react";
import './catalog.css';
import { Link } from "react-router-dom";
import $ from "jquery";
// npm install jquery bootstrap bootstrap-colorpicker
import "bootstrap/dist/css/bootstrap.min.css";
import "bootstrap-colorpicker/dist/css/bootstrap-colorpicker.min.css";
import "bootstrap-colorpicker";
import { createClothingArticle } from '../utils/repository';

function Catalog() {
  const [selectedType, setSelectedType] = useState("");
  const [selectedStyle, setSelectedStyle] = useState("");
  const [selectedVibes, setSelectedVibes] = useState([]);
  const [selectedColor, setSelectedColor] = useState("");

  const handleVibeChange = (event) => {
    const { value, checked } = event.target;
    setSelectedVibes((prev) =>
      checked ? [...prev, value] : prev.filter((vibe) => vibe !== value)
    );
  };

  useEffect(() => {
    // Initialize color picker
    // format: 'hex',
    $("#cp5d").colorpicker({
      inline: true,
      useAlpha: false // remove transparancy
    });

    // Disable by default
    $("#cp5d").colorpicker("disable");

    // Listen for color selection
    $("#cp5d").on("colorpickerChange", function (event) {
      setSelectedColor(event.color.toString());
    });

  }, []);

  useEffect(() => {
    // enable color picker iff at least one vibe is picked
    if (selectedVibes.length != 0 && selectedStyle) {
      $("#cp5d").colorpicker("enable");
    } else {
      $("#cp5d").colorpicker("disable");
    }
  }, [selectedVibes, selectedStyle]);

  // Check if all selections are made
  const isComplete = selectedType && selectedStyle && selectedVibes.length > 0 && selectedColor;

  return (
    <div className="App-background">
      <div className="pickers">
        <div className="catalogcontainer">
          {/* Column 1: Type Selection */}
          <div className="catalogcolumn1">

            <h3 className="maintitle2">Type</h3>
            <form className="radio-group">
              {[" Top", " Outerwear", " Bottoms", " Shoes"].map((type) => (
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

          {/* Column 2: Style Selection (appears iff type selected) */}
          <div className="catalogcolumn2">
            <h3 className="maintitle2">Style</h3>
            {selectedType === " Top" && (
              <form className="radio-group">
                {[" T-shirt", " Long Sleeve", " Collared shirt", " Tank Top", " Crop Top"].map((style) => (
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

            {selectedType === " Outerwear" && (
              <form className="radio-group">
                {[" Sweatshirt", " Sweater", " Jacket", " Coat", " Cardigan"].map((style) => (
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

            {selectedType === " Bottoms" && (
              <form className="radio-group">
                {[" Pants", " Shorts", " Skirt", " Leggings"].map((style) => (
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

            {selectedType === " Shoes" && (
              <form className="radio-group">
                {[" Sneakers", " Running", " Open-toe", " Heels", " Boots"].map((style) => (
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

          {/* Column 3: Vibe */}
          <div className="catalogcolumn3">
            <h3 className="maintitle2">Vibe</h3>
            <form className="checkbox-group">
              {[" Party", " Casual", " Formal", " Gym"].map((vibe) => (
                <label key={vibe}>
                  <input
                    type="checkbox"
                    value={vibe.toLowerCase()}
                    checked={selectedVibes.includes(vibe.toLowerCase())}
                    onChange={handleVibeChange}
                  />
                  {vibe}
                </label>
              ))}
            </form>
          </div>

          {/* Column 4: Color Selection */}
          <div className="catalogcolumn4">
            <h3 className="maintitle2">Color</h3>
            <div id="cp5d">
              <div className="input-group">
                <input
                  type="text"
                  className="form-control input-lg"
                  value={selectedColor || "Pick a color"}
                  disabled
                />
              </div>
            </div>
          </div>
        </div>
      </div>
      <div className="button-container">
        <Link to="/">
          <button className="backbutton" type="button">Back</button>
        </Link>

        {/* photo button */}
        <Link to={isComplete ? "/takephoto" : "#"} state={{
          type: selectedType.trim().toLowerCase(),
          style: selectedStyle.trim().toLowerCase(),
          vibes: selectedVibes,
          color: selectedColor
        }} onClick={(e) => !isComplete && e.preventDefault()}>
          <button className={`photobutton ${isComplete ? "enabled" : "disabled"}`} type="button" disabled={!isComplete}>
            Take Photo!
            <img src="/white_cam.png" alt="" className="digital_cam" />
          </button>
        </Link>
      </div>
    </div>
  );
}

export default Catalog;
