#titreTarificateur Assurance
Application de gestion des devis d'assurance pour les garanties de construction (DO, TRC et RCMO).

Vue d'ensemble
Le Tarificateur Assurance est une application web permettant aux courtiers et agents d'assurance de générer rapidement des devis pour les assurances de construction, incluant :

Dommage-Ouvrage (DO)
Tous Risques Chantier (TRC)
Responsabilité Civile Maître d'Ouvrage (RCMO)
L'application est composée d'un backend Flask et d'un frontend React, permettant la création de devis, leur modification, et la génération automatique de documents au format Word et PDF.

Caractéristiques
Gestion complète des devis

Création, consultation, modification des devis
Calcul automatique des primes selon le type de garantie
Gestion des options spécifiques (client VIP, ouvrages existants, etc.)
Génération de documents

Génération automatique de documents Word personnalisés
Conversion en PDF
Templates différents selon les garanties choisies
Interface utilisateur intuitive

Design moderne avec thème AXA
Formulaires dynamiques adaptés au type de garantie
Liste de devis filtrable et triable
Architecture technique
Backend (Flask)
API REST pour la gestion des devis
Base de données SQLite pour le stockage
Génération de documents Word et PDF
Validation des données et gestion des erreurs
Frontend (React)
Interface utilisateur React avec React Router pour la navigation
Composants réutilisables (formulaires, listes, etc.)
Axios pour les requêtes API
Bootstrap pour le design responsif
Prérequis
Python 3.8+
Node.js 16+
Microsoft Word (pour la génération de PDF)
Installation
Préparation
Clonez le dépôt :

Exécutez le script d'installation :

Alternativement, installez manuellement :

Backend
Créez un environnement virtuel Python :

Installez les dépendances :

Créez les dossiers nécessaires :

Placez vos templates Word dans le dossier template_docx :

template_do.docx
template_trc.docx
template_do_trc.docx
template_do_rcmo.docx
template_trc_rcmo.docx
template_do_trc_rcmo.docx
Frontend
Installez les dépendances :
Utilisation
Démarrez l'application :
Ou démarrez manuellement :

Backend :

Frontend :

Accédez à l'application dans votre navigateur :

Fonctionnalités détaillées
Création de devis
Naviguez vers "Nouveau devis"
Remplissez les détails du client et du projet
Sélectionnez le type de garantie (DO, TRC ou DO+TRC)
Ajoutez les options supplémentaires (RCMO, intervenants)
Vérifiez les montants calculés et ajustez si nécessaire
Soumettez le formulaire pour créer le devis
Gestion des devis existants
Liste des devis avec filtres et tri
Consultation détaillée de chaque devis
Téléchargement des documents au format Word ou PDF
Modification des devis existants
Templates de documents
Les documents générés contiennent :

Informations du client
Détails du projet et du chantier
Garanties et options choisies
Montants et franchises
Conditions générales
Structure du projet
API Reference
Endpoints
GET /api/devis - Liste tous les devis
GET /api/devis/<id> - Récupère un devis spécifique
POST /api/devis - Crée un nouveau devis
PATCH /api/devis/<id> - Modifie un devis existant
GET /api/devis/<id>/docx - Télécharge le document Word
GET /api/devis/<id>/pdf - Télécharge le document PDF
