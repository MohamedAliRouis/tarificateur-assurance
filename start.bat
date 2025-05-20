@echo off
echo ====================================
echo Démarrage de Tarificateur Assurance
echo ====================================

echo.
echo [1/2] Démarrage du backend Flask avec environnement virtuel...
start cmd /k "cd backend && call venv\Scripts\activate.bat && python app.py"

echo.
echo [2/2] Démarrage du frontend React...
start cmd /k "cd frontend && npm start"

echo.
echo Les deux composants de l'application ont été démarrés.
echo L'interface utilisateur sera accessible dans votre navigateur.
echo Si elle ne s'ouvre pas automatiquement, accédez à http://localhost:3000
echo.
echo Pour arrêter l'application, fermez les fenêtres de commande ouvertes.
echo ====================================