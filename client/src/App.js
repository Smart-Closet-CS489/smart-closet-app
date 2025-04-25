import './App.css';
import React, { useEffect } from "react";
import { Link } from "react-router-dom";
import { refreshData } from './utils/repository'
import { createModels } from './utils/coral-api'
function App() {

	useEffect(() => {
		createModels();
	}, []);

  return (
    <div className="App-background">
      <div className="App-Centering">
        <div className="App">
          <h1 className='maintitle'> Smart Closet </h1>
          <div>
            <Link to="/catalog">
              <button className="button" type="button">Add Clothing</button>
            </Link>
          </div>
          <div>
            <Link to="/pickvibe">
              <button className="button" type="button">Create Outfit</button>
            </Link>
          </div>
          <div>
            <button className='refresh_button' onClick={refreshData} type="button">↻</button>
          </div>
        </div>
      </div>
    </div>
  );
}

export default App;
