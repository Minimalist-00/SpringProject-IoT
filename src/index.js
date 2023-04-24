import React from "react";
import ReactDOM from "react-dom/client";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import Home from "./pages/Home";
// import Omikuji from './pages/Omikuji';
import "ress";
import "./style/index.css";
// import App from './App';

const root = ReactDOM.createRoot(document.getElementById("root"));
root.render(
  <React.StrictMode>
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<Home />} />
        {/* <Route path="/omikuji" element={<Omikuji/>}/> */}
      </Routes>
    </BrowserRouter>
  </React.StrictMode>
);
