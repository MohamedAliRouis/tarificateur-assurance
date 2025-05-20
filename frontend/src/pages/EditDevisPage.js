import React, { useState, useEffect } from "react";
import { useParams, Link } from "react-router-dom";
import { getDevisById, updateDevis } from "../services/api";
import DevisForm from "../components/DevisForm/DevisForm";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faCheckCircle, faList, faSpinner, faFileWord, faFilePdf } from "@fortawesome/free-solid-svg-icons";

const EditDevisPage = () => {
  const { id } = useParams();
  const [devis, setDevis] = useState(null);
  const [loading, setLoading] = useState(true);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState(null);
  const [success, setSuccess] = useState(false);

  useEffect(() => {
    const fetchDevis = async () => {
      try {
        setLoading(true);
        const response = await getDevisById(id);
        setDevis(response.data);
        setError(null);
      } catch (err) {
        console.error("Erreur lors du chargement du devis:", err);
        setError("Impossible de charger le devis. Veuillez réessayer.");
      } finally {
        setLoading(false);
      }
    };

    fetchDevis();
  }, [id]);

  const handleSubmit = async (formData) => {
    setIsSubmitting(true);
    setError(null);
    
    try {
      await updateDevis(id, formData);
      setSuccess(true);
    } catch (err) {
      console.error("Erreur lors de la modification du devis:", err);
      if (err.response?.data?.error) {
        setError(err.response.data.error);
      } else {
        setError("Une erreur est survenue lors de la modification du devis.");
      }
    } finally {
      setIsSubmitting(false);
    }
  };

  if (loading) {
    return (
      <div className="container py-4 text-center">
        <FontAwesomeIcon icon={faSpinner} spin size="3x" className="mb-3" />
        <p>Chargement du devis...</p>
      </div>
    );
  }

  if (error && !devis) {
    return (
      <div className="container py-4">
        <div className="alert alert-danger mb-4" role="alert">
          {error}
        </div>
        <Link to="/" className="btn btn-primary">
          <FontAwesomeIcon icon={faList} className="me-2" />
          Retourner à la liste des devis
        </Link>
      </div>
    );
  }

  return (
    <div className="container py-4">
      <h1 className="mb-4">
        Modification du devis {devis ? devis.numero_opportunite : ''}
      </h1>
      
      {error && (
        <div className="alert alert-danger mb-4" role="alert">
          {error}
        </div>
      )}
      
      {/* Section de téléchargement de documents */}
      {devis && (
        <div className="card mb-4">
          <div className="card-header bg-info text-white">
            <h3>Documents</h3>
          </div>
          <div className="card-body">
            <p>Vous pouvez générer les documents du devis via les boutons ci-dessous :</p>
            <div className="btn-group">
              <a 
                href={`http://localhost:5000/api/devis/${id}/docx`}
                className="btn btn-outline-primary" 
                target="_blank"
                rel="noopener noreferrer"
              >
                <FontAwesomeIcon icon={faFileWord} className="me-2" />
                Télécharger Word
              </a>
              <a 
                href={`http://localhost:5000/api/devis/${id}/pdf`}
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
      
      {success ? (
        <div className="alert alert-success mb-4" role="alert">
          <FontAwesomeIcon icon={faCheckCircle} className="me-2" />
          Devis modifié avec succès!
          
          <div className="mt-3">
            <Link to="/" className="btn btn-primary">
              <FontAwesomeIcon icon={faList} className="me-2" />
              Retourner à la liste des devis
            </Link>
          </div>
        </div>
      ) : (
        devis && <DevisForm 
          initialData={devis} 
          onSubmit={handleSubmit} 
          isSubmitting={isSubmitting}
          isEditing={true}
        />
      )}
    </div>
  );
};

export default EditDevisPage;