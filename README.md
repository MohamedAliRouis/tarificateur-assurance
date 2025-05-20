# Tarificateur Assurance
## Application de gestion des devis d'assurance pour les garanties de construction (DO, TRC et RCMO).


### Vue d'ensemble

Le Tarificateur Assurance est une application web permettant aux courtiers et agents d'assurance de générer rapidement des devis pour les assurances de construction, incluant :

- Dommage-Ouvrage (DO)
- Tous Risques Chantier (TRC)
- Responsabilité Civile Maître d'Ouvrage (RCMO)

L'application est composée d'un backend Flask et d'un frontend React, permettant la création de devis, leur modification, et la génération automatique de documents au format Word et PDF.

### Caractéristiques

- Gestion complète des devis
  - Création, consultation, modification des devis
  - Calcul automatique des primes selon le type de garantie
  - Gestion des options spécifiques (client VIP, ouvrages existants, etc.)
- Génération de documents
  - Génération automatique de documents Word personnalisés
  - Conversion en PDF
  - Templates différents selon les garanties choisies
- Interface utilisateur intuitive
  - Design moderne avec thème AXA
  - Formulaires dynamiques adaptés au type de garantie
  - Liste de devis filtrable et triable
  
### Architecture technique
Backend (Flask)
- API REST pour la gestion des devis
- Base de données SQLite pour le stockage
- Génération de documents Word et PDF
- Validation des données et gestion des erreurs

Frontend (React)
- Interface utilisateur React avec React Router pour la navigation
- Composants réutilisables (formulaires, listes, etc.)
- Axios pour les requêtes API
- Bootstrap pour le design responsif

### Prérequis
- Python 3.8+
- Node.js 16+
- Microsoft Word (pour la génération de PDF)

### Installation
1. Clonez le dépôt :
    ```sh
    git clone https://github.com/MohamedAliRouis/tarificateur-assurance.git
    cd tarificateur-assurance
    ```
2. Exécutez le script d'installation (ou double-cliquez dessus dans l'explorateur de fichiers) :
    ```sh
    .\setup.bat
    ```
Alternativement, installez manuellement :
Backend
1. Créez un environnement virtuel Python :
    ```sh
    cd backend
    python -m venv venv
    venv\Scripts\activate
    ```
2. Installez les dépendances :
    ```sh
    pip install -r requirements.txt
    ```
Frontend
1. Installez les dépendances :
    ```sh
    cd frontend
    npm install
    ```

### Utilisation
1. Exécutez le script de lancement (ou double-cliquez dessus dans l'explorateur de fichiers) :
     ```sh
    .\start.bat
    ```
Ou démarrez manuellement :
1. Backend :
     ```sh
    cd backend
    venv\Scripts\activate
    python app.py
    ```
2. Frontend :
     ```sh
    cd frontend
    npm start
    ```
3. Accédez à l'application dans votre navigateur :
http://localhost:3000

### Fonctionnalités détaillées
Création de devis
1. Naviguez vers "Nouveau devis"
2. Remplissez les détails du client et du projet
3. Sélectionnez le type de garantie (DO, TRC ou DO+TRC)
4. Ajoutez les options supplémentaires (RCMO, intervenants)
5. Vérifiez les montants des primes calculés et ajustez si nécessaire
6. Soumettez le formulaire pour créer le devis

Gestion des devis existants
- Liste des devis avec filtres et tri
- Consultation détaillée de chaque devis
- Téléchargement des documents au format Word ou PDF
- Modification des devis existants

Templates de documents
Les documents générés contiennent :
- Informations du client
- Détails du projet et du chantier
- Garanties et options choisies
- Montants et franchises
- Conditions générales

### Structure du projet
    
        tarificateur-app/
    │
    ├── backend/                # Serveur Flask
    │   ├── venv/              # Environnement virtuel Python
    │   ├── app.py             # Application principale
    │   ├── test_app.py        # Tests unitaires
    │   ├── requirements.txt   # Dépendances Python
    │   ├── template_docx/     # Templates Word pour les documents
    │   └── documents/         # Documents générés (Word et PDF)
    │
    ├── frontend/              # Application React
    │   ├── public/            # Fichiers statiques
    │   └── src/               # Code source React
    │       ├── components/    # Composants réutilisables
    │       ├── pages/         # Pages de l'application
    │       ├── services/      # Services (API, calculs, etc.)
    │       └── styles/        # Fichiers CSS
    │
    ├── setup.bat              # Script d'installation
    └── start.bat              # Script de démarrage
    
