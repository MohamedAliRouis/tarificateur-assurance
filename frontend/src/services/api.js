import axios from 'axios';

const API_URL = 'http://localhost:5000/api';

// Fonctions d'API pour les devis
export const getDevisList = () => axios.get(`${API_URL}/devis`);
export const getDevisById = (id) => axios.get(`${API_URL}/devis/${id}`);
export const createDevis = (devisData) => axios.post(`${API_URL}/devis`, devisData);
export const updateDevis = (id, devisData) => axios.patch(`${API_URL}/devis/${id}`, devisData);
export const getDocxUrl = (id) => `${API_URL}/devis/${id}/docx`;
export const getPdfUrl = (id) => `${API_URL}/devis/${id}/pdf`;

// Pour la compatibilité avec le code existant
const api = {
  getAllDevis: getDevisList,
  getDevis: getDevisById,
  createDevis,
  updateDevis,
  getDevisDocx: getDocxUrl,
  getDevisPdf: getPdfUrl
};

export default api;