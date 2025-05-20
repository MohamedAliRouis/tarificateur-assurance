@echo off
echo ====================================
echo Installation de Tarificateur Assurance
echo ====================================

echo.
echo [1/3] Création de l'environnement virtuel Python...
cd backend
if exist venv (
    echo L'environnement virtuel existe déjà.
) else (
    python -m venv venv
    echo Environnement virtuel créé avec succès.
)

echo.
echo [2/3] Activation de l'environnement virtuel et installation des dépendances Python...
call venv\Scripts\activate.bat
pip install --upgrade pip
pip install -r requirements.txt
call venv\Scripts\deactivate.bat
cd ..

echo.
echo [3/3] Installation des dépendances Node.js pour le frontend...
cd frontend
npm install
cd ..

echo.
echo Configuration terminée !
echo.
echo Installation terminée avec succès !
echo.
echo Pour démarrer l'application, exécutez start.bat
echo ====================================
pause