import React from "react";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import PageNotFound from "./pages/PageNotFound";

import './App.css';
import 'bootstrap/dist/css/bootstrap.min.css';
import Company from "./pages/Company";

const App = () => {
  return (
    <div className="App">
        <BrowserRouter>
            <Routes>
                <Route path="/" element={<Company />} />
                <Route path="*" element={<PageNotFound />} />
            </Routes>
        </BrowserRouter>
    </div>
  );
};

export default App;
