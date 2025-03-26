import './App.css';
import React from "react";
import {Link } from "react-router-dom";


function App() {
  return (
    <div className="App">
      <h1> Smart Closet </h1>
      <Link to="/catalog"><button type="button">Add Clothing</button></Link>
			<Link to="/pickvibe"><button type="button">Create Outfit</button></Link>
 
    </div>
  );
}

export default App;
