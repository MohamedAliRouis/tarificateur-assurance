// src/pages/NouveauDevisPage.js
import React, { useState } from "react";
import { Link } from "react-router-dom";
import { createDevis } from "../services/api";
import DevisForm from "../components/DevisForm/DevisForm";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faCheckCircle, faList, faFileWord, faFilePdf } from "@fortawesome/free-solid-svg-icons";

const NouveauDevisPage = () => {
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState(null);
  const [success, setSuccess] = useState(false);
  const [createdDevisId, setCreatedDevisId] = useState(null);

  const handleSubmit = async (formData) => {
    setIsSubmitting(true);
    setError(null);
    
    try {
      const response = await createDevis(formData);
      const devisId = response.data.id;
      
      // Afficher message de succès
      setSuccess(true);
      setCreatedDevisId(devisId);
    } catch (err) {
      console.error("Erreur lors de la création du devis:", err);
      if (err.response?.data?.error) {
        setError(err.response.data.error);
      } else {
        setError("Une erreur est survenue lors de la création du devis.");
      }
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="container py-4">
      <h1 className="mb-4">Nouveau devis</h1>
      
      {error && (
        <div className="alert alert-danger mb-4" role="alert">
          {error}
        </div>
      )}
      
      {success ? (
        <>
          <div className="alert alert-success mb-4" role="alert">
            <FontAwesomeIcon icon={faCheckCircle} className="me-2" />
            Devis créé avec succès !
          </div>
          
          {createdDevisId && (
            <div className="card mb-4">
              <div className="card-header bg-info text-white">
                <h3>Documents</h3>
              </div>
              <div className="card-body">
                <p>Vous pouvez générer les documents du devis via les boutons ci-dessous :</p>
                <div className="btn-group">
                  <a 
                    href={`http://localhost:5000/api/devis/${createdDevisId}/docx`}
                    className="btn btn-outline-primary" 
                    target="_blank"
                    rel="noopener noreferrer"
                  >
                    <FontAwesomeIcon icon={faFileWord} className="me-2" />
                    Télécharger Word
                  </a>
                  <a 
                    href={`http://localhost:5000/api/devis/${createdDevisId}/pdf`}
                    className="btn btn-outline-danger" 
                    target="_blank"
                    rel="noopener noreferrer"
                  >
                    <FontAwesomeIcon icon={faFilePdf} className="me-2" />
                    Télécharger PDF
                  </a>
                </div>
              </div>
            </div>
          )}
          
          <div className="mt-3">
            <Link to="/" className="btn btn-primary">
              <FontAwesomeIcon icon={faList} className="me-2" />
              Retourner à la liste des devis
            </Link>
          </div>
        </>
      ) : (
        <DevisForm onSubmit={handleSubmit} isSubmitting={isSubmitting} />
      )}
    </div>
  );
};

export default NouveauDevisPage;