import React from 'react';
import ReactDOM from 'react-dom/client';
import { BrowserRouter, Route, Routes } from "react-router-dom";

import './index.css';
import App from './App';
import reportWebVitals from './reportWebVitals';

// Pages
import Catalog from "./pages/catalog";
import TakePhoto from "./pages/takephoto";
import PickVibes from "./pages/pickvibe";
import GenerateFit from "./pages/generatefit";


const root = ReactDOM.createRoot(document.getElementById('root'));
root.render(
	<React.StrictMode>
		<BrowserRouter>
			<Routes>
				<Route path="/" element={<App />} />
				<Route path="/catalog" element={<Catalog />} />
				<Route path="/takephoto" element={<TakePhoto />} />
				<Route path="/pickvibe" element={<PickVibes />} />
				<Route path="/generatefit" element={<GenerateFit />} />
			</Routes>
		</BrowserRouter>
	</React.StrictMode>
);
/*
 
);*/

// If you want to start measuring performance in your app, pass a function
// to log results (for example: reportWebVitals(console.log))
// or send to an analytics endpoint. Learn more: https://bit.ly/CRA-vitals
reportWebVitals();

