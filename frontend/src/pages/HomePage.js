// src/pages/HomePage.js
import React, { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import DevisList from "../components/DevisList/DevisList";
import { getDevisList } from "../services/api";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faPlus, faSpinner } from "@fortawesome/free-solid-svg-icons";

const HomePage = () => {
  const [devis, setDevis] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const loadDevis = async () => {
      try {
        setLoading(true);
        const response = await getDevisList();
        setDevis(response.data);
        setError(null);
      } catch (err) {
        console.error("Erreur lors du chargement des devis:", err);
        setError("Impossible de charger les devis. Veuillez réessayer.");
      } finally {
        setLoading(false);
      }
    };

    loadDevis();
  }, []);

  return (
    <div className="container py-4">
      <div className="d-flex justify-content-between align-items-center mb-4">
        <h1>Liste des Devis</h1>
        <Link to="/nouveau-devis" className="btn btn-primary">
          <FontAwesomeIcon icon={faPlus} className="me-2" /> Nouveau devis
        </Link>
      </div>

      {loading ? (
        <div className="text-center my-5">
          <FontAwesomeIcon icon={faSpinner} spin size="3x" className="mb-3" />
          <p>Chargement des devis...</p>
        </div>
      ) : error ? (
        <div className="alert alert-danger" role="alert">
          {error}
        </div>
      ) : (
        <DevisList data={devis} />
      )}
    </div>
  );
};

export default HomePage;