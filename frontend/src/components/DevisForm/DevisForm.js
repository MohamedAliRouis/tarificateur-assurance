// src/components/DevisForm/DevisForm.js
import React, { useState, useEffect } from "react";
import "./DevisForm.css";
import {
  NumericInput,
  TextInput,
  CheckboxInput,
  SelectInput,
  FormCard
} from "./FormComponents";

// Default form data object defined outside the component
const defaultFormData = {
  numero_opportunite: "",
  nom_client: "",
  type_travaux: "",
  cout_ouvrage: "",
  presence_existant: false,
  client_vip: false,
  garantie: "",
  souhaite_rcmo: false,
  assurer_intervenants: false,
  montant_dm: "",
  montant_maintenance_visite: "",
  montant_mesures_conservatoires: "",
  taux_rcmo: "",
  franchise_rcmo: "",
  montant_rcmo: "",
  montant_do: "",
  montant_trc: "",
  destination_ouvrage: "",
  adresse_chantier: "",
  description_ouvrage: "",
  taux_do: "",
  taux_trc: "",
  franchise_trc: "",
  franchise_maintenance: "",
};

// Define field types outside the component for better organization
const numericFields = new Set([
  "cout_ouvrage", "taux_do", "taux_trc", "taux_rcmo",
  "franchise_rcmo", "montant_rcmo", "montant_do", 
  "montant_trc", "franchise_trc", 
  "franchise_maintenance", "montant_dm", 
  "montant_maintenance_visite", "montant_mesures_conservatoires"
]);

// Validation schema - centralized rules for form fields
const validationSchema = {
  // Client information fields
  numero_opportunite: { 
    required: true, 
    message: "Le numéro d'opportunité est obligatoire" 
  },
  nom_client: { 
    required: true, 
    message: "Le nom du client est obligatoire" 
  },
  adresse_chantier: {
    required: true,
    message: "L'adresse du chantier est obligatoire"
  },
  
  // Guarantee options
  garantie: {
    required: true,
    message: "Le type de garantie est obligatoire"
  },
  montant_do: {
    numeric: true,
    requiredIf: (data) => data.garantie === "DO" || data.garantie === "DO+TRC",
    message: "Le montant de garantie DO est obligatoire"
  },
  montant_dm: {
    numeric: true,
    requiredIf: (data) => data.garantie === "TRC" || data.garantie === "DO+TRC",
    message: "Le montant Dommages matériels est obligatoire"
  },
  montant_maintenance_visite: {
    numeric: true,
    requiredIf: (data) => data.garantie === "TRC" || data.garantie === "DO+TRC",
    message: "Le montant Maintenance-visite est obligatoire"
  },
  montant_mesures_conservatoires: {
    numeric: true,
    requiredIf: (data) => data.garantie === "TRC" || data.garantie === "DO+TRC",
    message: "Le montant Mesures conservatoires est obligatoire"
  },
  montant_trc: {
    numeric: true,
    requiredIf: (data) => data.garantie === "TRC" || data.garantie === "DO+TRC",
    message: "Le montant Responsabilité civile est obligatoire"
  },
  montant_rcmo: {
    numeric: true,
    requiredIf: (data) => data.souhaite_rcmo,
    message: "Le montant de garantie RCMO est obligatoire"
  },
  
  // Structure characteristics
  type_travaux: { 
    required: true, 
    message: "Le type de travaux est obligatoire" 
  },
  destination_ouvrage: {
    requiredIf: (data) => data.garantie === "DO" || data.garantie === "DO+TRC",
    message: "La destination de l'ouvrage est obligatoire"
  },
  cout_ouvrage: { 
    required: true,
    numeric: true, 
    message: "Le coût de l'ouvrage est obligatoire" 
  },
  description_ouvrage: {
    required: true,
    message: "La description de l'ouvrage est obligatoire"
  },
  
  // Pricing fields
  taux_do: { 
    numeric: true, 
    requiredIf: (data) => data.garantie === "DO" || data.garantie === "DO+TRC",
    message: "Le taux DO est obligatoire" 
  },
  taux_trc: { 
    numeric: true, 
    requiredIf: (data) => data.garantie === "TRC" || data.garantie === "DO+TRC",
    message: "Le taux TRC est obligatoire" 
  },
  taux_rcmo: { 
    numeric: true, 
    requiredIf: (data) => data.souhaite_rcmo,
    message: "Le taux RCMO est obligatoire" 
  },
  
  // Franchise fields
  franchise_trc: {
    numeric: true,
    requiredIf: (data) => data.garantie === "TRC" || data.garantie === "DO+TRC",
    message: "La franchise pour dommages aux ouvrages est obligatoire"
  },
  franchise_rcmo: {
    numeric: true,
    requiredIf: (data) => data.souhaite_rcmo,
    message: "La franchise RCMO est obligatoire"
  },
  franchise_maintenance: {
    numeric: true,
    requiredIf: (data) => data.garantie === "TRC" || data.garantie === "DO+TRC",
    message: "La franchise Maintenance-visite est obligatoire"
  }
};

const isRequiredNumberInvalid = (value) => {
  // Handle 0 as a valid number
  if (value === 0) return false;
  return !value || isNaN(value);
};



const DevisForm = ({ onSubmit, isSubmitting, initialData = {}, isEditing = false }) => {
  // Simplified state initialization using the default object
  const [formData, setFormData] = useState({ ...defaultFormData, ...initialData });
  const [errors, setErrors] = useState({});
  const [calculatedValues, setCalculatedValues] = useState({
    prime_do: 0,
    prime_trc: 0,
    prime_rcmo: 0,
    prime_totale: 0
  });

  useEffect(() => {
    const cout = parseFloat(formData.cout_ouvrage) || 0;
    const tauxDO = parseFloat(formData.taux_do) || 0;
    const tauxTRC = parseFloat(formData.taux_trc) || 0;
    const tauxRCMO = parseFloat(formData.taux_rcmo) || 0;

    const primeDO = (formData.garantie === "DO" || formData.garantie === "DO+TRC")
      ? (cout * tauxDO / 100)
      : 0;

    const primeTRC = (formData.garantie === "TRC" || formData.garantie === "DO+TRC")
      ? (cout * tauxTRC / 100)
      : 0;

    const primeRCMO = formData.souhaite_rcmo
      ? (cout * tauxRCMO / 100)
      : 0;

    const primeTotale = primeDO + primeTRC + primeRCMO;

    setCalculatedValues({
      prime_do: primeDO,
      prime_trc: primeTRC,
      prime_rcmo: primeRCMO,
      prime_totale: primeTotale
    });
  }, [formData.cout_ouvrage, formData.taux_do, formData.taux_trc, formData.taux_rcmo,
      formData.garantie, formData.souhaite_rcmo]);

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;
    let newValue = type === "checkbox" ? checked : value;

    if (numericFields.has(name)) {
      // Only parse if we have a non-empty value
      newValue = value === "" ? "" : parseFloat(value);
    }

    const newFormData = {
      ...formData,
      [name]: newValue
    };

    // Réinitialisation des champs conditionnels si nécessaire
    if (name === "garantie") {
      if (value !== "DO" && value !== "DO+TRC") {
        newFormData.montant_do = "";
        newFormData.taux_do = "";
      }
      if (value !== "TRC" && value !== "DO+TRC") {
        newFormData.montant_dm = "";
        newFormData.montant_maintenance_visite = "";
        newFormData.montant_mesures_conservatoires = "";
        newFormData.montant_trc = "";
        newFormData.taux_trc = "";
        newFormData.franchise_trc = "";
        newFormData.franchise_maintenance = "";
      }
    }
    
    if (name === "souhaite_rcmo" && !checked) {
      newFormData.montant_rcmo = "";
      newFormData.taux_rcmo = "";
      newFormData.franchise_rcmo = "";
      newFormData.assurer_intervenants = false;
    }

    setFormData(newFormData);

    // Effacer les erreurs pour le champ modifié
    if (errors[name]) {
      setErrors(prev => ({
        ...prev,
        [name]: null
      }));
    }
  };

  const validateForm = () => {
    const newErrors = {};

    // Validation générique basée sur le schéma
    Object.entries(validationSchema).forEach(([fieldName, rules]) => {
      const value = formData[fieldName];
      
      // Debug pour identifier les champs problématiques
      if (formData.garantie === "DO+TRC" && (value === null)) {
        console.log(`Champ ${fieldName} est null avec DO+TRC`, value);
      }
      
      const isFieldRelevant = () => {
        // Vérification spécifique pour la destination de l'ouvrage
        if (fieldName === 'destination_ouvrage') {
          return formData.garantie === "DO";
        }
        
        // Reste de la logique inchangée
        if ((fieldName === 'montant_do' || fieldName === 'taux_do') && 
            !(formData.garantie === "DO" || formData.garantie === "DO+TRC")) {
          return false;
        }
        
        if ((fieldName === 'montant_dm' || fieldName === 'montant_maintenance_visite' || 
             fieldName === 'montant_mesures_conservatoires' || fieldName === 'montant_trc' || 
             fieldName === 'taux_trc' || fieldName === 'franchise_trc' || 
             fieldName === 'franchise_maintenance') && 
            !(formData.garantie === "TRC" || formData.garantie === "DO+TRC")) {
          return false;
        }
        
        if ((fieldName === 'montant_rcmo' || fieldName === 'taux_rcmo' || 
             fieldName === 'franchise_rcmo') && !formData.souhaite_rcmo) {
          return false;
        }
        
        return true;
      };
      
      if (!isFieldRelevant()) {
        return;
      }
      
      if (rules.required && (value === "" || value === null || value === undefined)) {
        newErrors[fieldName] = rules.message;
        return;
      }
      
      if (rules.requiredIf && rules.requiredIf(formData)) {
        if (rules.numeric && isRequiredNumberInvalid(value)) {
          newErrors[fieldName] = rules.message;
          return;
        } else if (!rules.numeric && (value === "" || value === null || value === undefined)) {
          newErrors[fieldName] = rules.message;
          return;
        }
      }
      
      if (rules.numeric && !isRequiredNumberInvalid(value) && isNaN(value) && value !== "") {
        newErrors[fieldName] = "Format numérique invalide";
        return;
      }
    });
    
    console.log("Erreurs de validation:", newErrors); // Debug log
    
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = (e) => {
    e.preventDefault();

    if (!validateForm()) {
      // Ajout d'un scroll vers la première erreur
      const firstErrorField = Object.keys(errors)[0];
      if (firstErrorField) {
        const errorElement = document.querySelector(`[name="${firstErrorField}"]`);
        if (errorElement) {
          errorElement.scrollIntoView({ behavior: 'smooth', block: 'center' });
          errorElement.focus();
        }
      }
      return;
    }

    const dataToSubmit = {
      ...formData,
      prime_do: calculatedValues.prime_do,
      prime_trc: calculatedValues.prime_trc,
      prime_rcmo: calculatedValues.prime_rcmo,
      prime_totale: calculatedValues.prime_totale
    };

    onSubmit(dataToSubmit);
  };

  return (
    <form onSubmit={handleSubmit} className="devis-form">
      <FormCard title="Informations client">
        <TextInput
          label="Numéro d'opportunité"
          name="numero_opportunite"
          value={formData.numero_opportunite === null ? "" : formData.numero_opportunite}
          onChange={handleChange}
          error={errors.numero_opportunite}
          required={true}
        />

        <TextInput
          label="Nom du client"
          name="nom_client"
          value={formData.nom_client === null ? "" : formData.nom_client}
          onChange={handleChange}
          error={errors.nom_client}
          required={true}
        />

        <TextInput
          label="Adresse du chantier"
          name="adresse_chantier"
          value={formData.adresse_chantier === null ? "" : formData.adresse_chantier}
          onChange={handleChange}
          className="col-12 mb-3"
          required={true}
          error={errors.adresse_chantier}
        />

        <CheckboxInput
          label="Client VIP"
          name="client_vip"
          checked={formData.client_vip}
          onChange={handleChange}
        />
      </FormCard>

      <FormCard title="Options de garantie">
        <div className="row mb-3">
          <div className="col-md-6">
            <SelectInput
              label="Type de garantie"
              name="garantie"
              value={formData.garantie === null ? "" : formData.garantie}
              onChange={handleChange}
              options={[
                { value: "DO", label: "DO" },
                { value: "TRC", label: "TRC" },
                { value: "DO+TRC", label: "DO+TRC" }
              ]}
              required={true}
              error={errors.garantie}
            />

            {(formData.garantie === "DO" || formData.garantie === "DO+TRC") && (
              <NumericInput
                label="Montant de garantie DO (€)"
                name="montant_do"
                value={formData.montant_do === null ? "" : formData.montant_do}
                onChange={handleChange}
                error={errors.montant_do}
                step="1"
                required={true}
                className="mt-3"
              />
            )}
          </div>

          <div className="col-md-6">
            <div className="mb-3 mt-2">
              <CheckboxInput
                label="Souhaite RCMO"
                name="souhaite_rcmo"
                checked={formData.souhaite_rcmo}
                onChange={handleChange}
              />
              
              {formData.souhaite_rcmo && (
                <>
                  <CheckboxInput
                    label="Assurer intervenants"
                    name="assurer_intervenants"
                    checked={formData.assurer_intervenants}
                    onChange={handleChange}
                    className="ms-4"
                  />
                  
                  <NumericInput
                    label="Montant de garantie RCMO (€)"
                    name="montant_rcmo"
                    value={formData.montant_rcmo === null ? "" : formData.montant_rcmo}
                    onChange={handleChange}
                    required={true}
                    error={errors.montant_rcmo}
                    step="1"
                    className="mt-2"
                  />
                </>
              )}
            </div>
          </div>
        </div>

        {(formData.garantie === "TRC" || formData.garantie === "DO+TRC") && (
          <div className="mt-2">
            <h5>Garanties complémentaires TRC</h5>
            
            <div className="row">
              <div className="col-md-6">
                <NumericInput
                  label="Montant Dommages matériels à l'ouvrage (€)"
                  name="montant_dm"
                  value={formData.montant_dm === null ? "" : formData.montant_dm}
                  onChange={handleChange}
                  error={errors.montant_dm}
                  step="1"
                  required={true}
                  className="mt-2"
                />
                
                <NumericInput
                  label="Montant Maintenance-visite (€)"
                  name="montant_maintenance_visite"
                  value={formData.montant_maintenance_visite === null ? "" : formData.montant_maintenance_visite}
                  onChange={handleChange}
                  error={errors.montant_maintenance_visite}
                  step="1"
                  className="mt-3"
                  required={true}
                />
              </div>
              
              <div className="col-md-6">
                <NumericInput
                  label="Montant Mesures conservatoires (€)"
                  name="montant_mesures_conservatoires"
                  value={formData.montant_mesures_conservatoires === null ? "" : formData.montant_mesures_conservatoires}
                  onChange={handleChange}
                  error={errors.montant_mesures_conservatoires}
                  step="1"
                  className="mt-2"
                  required={true}
                />
                
                <NumericInput
                  label="Montant Responsabilité civile (tous dommages confondus) (€)"
                  name="montant_trc"
                  value={formData.montant_trc === null ? "" : formData.montant_trc}
                  onChange={handleChange}
                  error={errors.montant_trc}
                  step="1"
                  className="mt-3"
                  required={true}
                />
              </div>
            </div>
          </div>
        )}
      </FormCard>

      <FormCard title="Caractéristiques de l'ouvrage">
        <SelectInput
          label="Type de travaux"
          name="type_travaux"
          value={formData.type_travaux === null ? "" : formData.type_travaux}
          onChange={handleChange}
          options={[
            { value: "Neuf", label: "Neuf" },
            { value: "Rénovation légère", label: "Rénovation légère" },
            { value: "Rénovation lourde", label: "Rénovation lourde" }
          ]}
        />

        {formData.garantie === "DO" && (
          <SelectInput
            label="Destination de l'ouvrage"
            name="destination_ouvrage"
            value={formData.destination_ouvrage === null ? "" : formData.destination_ouvrage}
            onChange={handleChange}
            error={errors.destination_ouvrage}
            required={formData.garantie === "DO"}
            options={[
              { value: "Habitation", label: "Habitation" },
              { value: "Hors habitation", label: "Hors habitation" }
            ]}
          />
        )}

        <NumericInput
          label="Coût de l'ouvrage (€)"
          name="cout_ouvrage"
          value={formData.cout_ouvrage === null ? "" : formData.cout_ouvrage}
          onChange={handleChange}
          error={errors.cout_ouvrage}
          required={true}
        />

        <CheckboxInput
          label="Présence d'existant"
          name="presence_existant"
          checked={formData.presence_existant}
          onChange={handleChange}
        />

        <TextInput
          label="Description de l'ouvrage"
          name="description_ouvrage"
          value={formData.description_ouvrage === null ? "" : formData.description_ouvrage}
          onChange={handleChange}
          className="col-12 mb-3"
          rows={3}
          required={true}
          error={errors.description_ouvrage}
        />
      </FormCard>

      <FormCard title="Tarification">
        {(formData.garantie === "DO" || formData.garantie === "DO+TRC") && (
          <NumericInput
            label="Taux DO (%)"
            name="taux_do"
            value={formData.taux_do === null ? "" : formData.taux_do}
            onChange={handleChange}
            error={errors.taux_do}
            max="100"
            required={true}
          />
        )}
        
        {(formData.garantie === "TRC" || formData.garantie === "DO+TRC") && (
          <NumericInput
            label="Taux TRC (%)"
            name="taux_trc"
            value={formData.taux_trc === null ? "" : formData.taux_trc}
            onChange={handleChange}
            error={errors.taux_trc}
            max="100"
            required={true}
          />
        )}
        
        {formData.souhaite_rcmo && (
          <NumericInput
            label="Taux RCMO (%)"
            name="taux_rcmo"
            value={formData.taux_rcmo === null ? "" : formData.taux_rcmo}
            onChange={handleChange}
            error={errors.taux_rcmo}
            max="100"
          />
        )}
        
        {formData.garantie !== "DO" && formData.garantie !== "TRC" && formData.garantie !== "DO+TRC" && !formData.souhaite_rcmo && (
          <div className="col-12">
            <div className="alert alert-warning">
              Veuillez sélectionner un type de garantie pour voir les options de tarification.
            </div>
          </div>
        )}
      </FormCard>

      {((formData.garantie === "TRC" || formData.garantie === "DO+TRC") || formData.souhaite_rcmo) && (
        <FormCard title="Franchises">
          {(formData.garantie === "TRC" || formData.garantie === "DO+TRC") && (
            <NumericInput
              label="Dommages subis par les ouvrages de bâtiment (€)"
              name="franchise_trc"
              value={formData.franchise_trc === null ? "" : formData.franchise_trc}
              onChange={handleChange}
              error={errors.franchise_trc}
              step="1"
              className="col-md-4 mb-3"
            />
          )}
          
          {formData.souhaite_rcmo && (
            <NumericInput
              label="Franchise RCMO (€)"
              name="franchise_rcmo"
              value={formData.franchise_rcmo === null ? "" : formData.franchise_rcmo}
              onChange={handleChange}
              error={errors.franchise_rcmo}
              step="1"
              className="col-md-4 mb-3"
            />
          )}
          
          {(formData.garantie === "TRC" || formData.garantie === "DO+TRC") && (
            <NumericInput
              label="Maintenance-visite (€)"
              name="franchise_maintenance"
              value={formData.franchise_maintenance === null ? "" : formData.franchise_maintenance}
              onChange={handleChange}
              error={errors.franchise_maintenance}
              step="1"
              className="col-md-4 mb-3"
            />
          )}
        </FormCard>
      )}

      <FormCard title="Récapitulatif des primes" headerClass="bg-success">
        <div className="col-md-12">
          <table className="table table-striped">
            <tbody>
              {(formData.garantie === "DO" || formData.garantie === "DO+TRC") && (
                <tr>
                  <td className="fw-bold">Prime Dommage Ouvrage</td>
                  <td className="text-end">{calculatedValues.prime_do.toLocaleString('fr-FR', { minimumFractionDigits: 2, maximumFractionDigits: 2 })} €</td>
                </tr>
              )}
              
              {(formData.garantie === "TRC" || formData.garantie === "DO+TRC") && (
                <tr>
                  <td className="fw-bold">Prime TRC</td>
                  <td className="text-end">{calculatedValues.prime_trc.toLocaleString('fr-FR', { minimumFractionDigits: 2, maximumFractionDigits: 2 })} €</td>
                </tr>
              )}
              
              {formData.souhaite_rcmo && (
                <tr>
                  <td className="fw-bold">Prime RCMO</td>
                  <td className="text-end">{calculatedValues.prime_rcmo.toLocaleString('fr-FR', { minimumFractionDigits: 2, maximumFractionDigits: 2 })} €</td>
                </tr>
              )}
              
              <tr className="table-primary">
                <td className="fw-bold fs-5">Prime totale</td>
                <td className="text-end fw-bold fs-5">{calculatedValues.prime_totale.toLocaleString('fr-FR', { minimumFractionDigits: 2, maximumFractionDigits: 2 })} €</td>
              </tr>
            </tbody>
          </table>
        </div>
      </FormCard>

      <div className="d-flex justify-content-between mt-4 mb-5">
        <button 
          type="button" 
          className="btn btn-outline-secondary" 
          onClick={() => window.history.back()}
        >
          Annuler
        </button>
        <button 
          type="submit" 
          className="btn btn-primary" 
          disabled={isSubmitting}
        >
          {isSubmitting ? (
            <>
              <span className="spinner-border spinner-border-sm me-2" role="status" aria-hidden="true"></span>
              {isEditing ? "Mise à jour en cours..." : "Génération en cours..."}
            </>
          ) : (
            isEditing ? "Enregistrer les modifications" : "Valider et générer proposition"
          )}
        </button>
      </div>
    </form>
  );
};

export default DevisForm;