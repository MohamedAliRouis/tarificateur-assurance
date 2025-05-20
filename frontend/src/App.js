// src/App.js
import React from "react";
import { BrowserRouter as Router, Routes, Route, Link } from "react-router-dom";
import HomePage from "./pages/HomePage";
import NouveauDevisPage from "./pages/NouveauDevisPage";
import EditDevisPage from "./pages/EditDevisPage";
import "bootstrap/dist/css/bootstrap.min.css";
import "./styles/axa-theme.css";
import axaLogo from "./assets/images/logo-axa.svg";

function App() {
  return (
    <Router>
      <div className="app-container">
        <header className="bg-white shadow-sm">
          <div className="container">
            {/* Logo et nom avec lien vers la page d'accueil */}
            <Link to="/" className="text-decoration-none d-block pt-3">
              <div className="d-flex align-items-center">
                <img src={axaLogo} alt="AXA Logo" height="50" />
              </div>
            </Link>
            
            {/* Ligne séparatrice */}
            <hr className="my-3" />
            
            {/* Titre */}
            <h1 className="text-center mb-3 axa-blue-text fw-bold">Tarificateur Assurance</h1>
          </div>
        </header>
        
        <main>
          <Routes>
            <Route path="/" element={<HomePage />} />
            <Route path="/nouveau-devis" element={<NouveauDevisPage />} />
            <Route path="/devis/:id/edit" element={<EditDevisPage />} />
          </Routes>
        </main>
        
        <footer className="bg-light py-3 mt-5">
          <div className="container text-center text-muted">
            <p className="m-0">&copy; {new Date().getFullYear()} AXA Assurance IARD</p>
          </div>
        </footer>
      </div>
    </Router>
  );
}

export default App;