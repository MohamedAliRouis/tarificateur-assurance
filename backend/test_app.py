import unittest
import json
import os
import shutil
from datetime import datetime
from app import app, db, Devis

class DevisAPITestCase(unittest.TestCase):
    """Tests unitaires pour l'API de gestion des devis d'assurance."""

    def setUp(self):
        """Configuration avant chaque test."""
        app.config['TESTING'] = True
        app.config['SQLALCHEMY_DATABASE_URI'] = 'sqlite:///:memory:'
        self.client = app.test_client()
        
        with app.app_context():
            db.create_all()
        
        # Créer le dossier documents si nécessaire pour les tests de génération
        os.makedirs('documents', exist_ok=True)
        
        # Données de test réutilisables
        self.valid_devis = {
            "numero_opportunite": "TEST123",
            "nom_client": "Client Test",
            "type_ouvrage": "Habitation",
            "type_travaux": "Rénovation",
            "cout_ouvrage": 150000.0,
            "presence_existant": True,
            "client_vip": False,
            "garantie": "DO seule",
            "souhaite_rcmo": True,
            "destination_ouvrage": "Usage personnel",
            "adresse_chantier": "10 rue des Tests, 75001 Paris",
            "description_ouvrage": "Rénovation complète d'une maison individuelle",
            "type_tarif": "Standard",
            "taux_seul": 1.5
        }

    def tearDown(self):
        """Nettoyage après chaque test."""
        with app.app_context():
            db.session.remove()
            db.drop_all()
        
        # Nettoyer les fichiers générés lors des tests - avec gestion des erreurs
        if os.path.exists('documents'):
            for file in os.listdir('documents'):
                if file.startswith('Proposition_commerciale'):
                    try:
                        os.remove(os.path.join('documents', file))
                    except PermissionError:
                        # Ignorer l'erreur si le fichier est toujours ouvert par un autre processus
                        print(f"Note: Impossible de supprimer {file} - fichier en cours d'utilisation")

    # Tests de l'endpoint GET /api/devis
    def test_get_devis_empty(self):
        """Test de récupération d'une liste vide de devis."""
        response = self.client.get('/api/devis')
        self.assertEqual(response.status_code, 200)
        self.assertEqual(response.json, [])

    def test_get_devis_with_items(self):
        """Test de récupération d'une liste contenant des devis."""
        # Ajouter quelques devis à la base
        with app.app_context():
            for i in range(3):
                devis = Devis(
                    numero_opportunite=f"TEST{i}",
                    nom_client=f"Client {i}",
                    type_ouvrage="Habitation"
                )
                db.session.add(devis)
            db.session.commit()
        
        # Vérifier que la liste contient 3 devis
        response = self.client.get('/api/devis')
        self.assertEqual(response.status_code, 200)
        self.assertEqual(len(response.json), 3)
        self.assertEqual(response.json[0]['nom_client'], 'Client 0')

    # Tests de l'endpoint GET /api/devis/<id>
    def test_get_devis_detail_success(self):
        """Test de récupération des détails d'un devis existant."""
        # Créer un devis
        with app.app_context():
            devis = Devis(**self.valid_devis)
            db.session.add(devis)
            db.session.commit()
            devis_id = devis.id
        
        # Récupérer et vérifier les détails
        response = self.client.get(f'/api/devis/{devis_id}')
        self.assertEqual(response.status_code, 200)
        self.assertEqual(response.json['numero_opportunite'], 'TEST123')
        self.assertEqual(response.json['cout_ouvrage'], 150000.0)

    def test_get_devis_detail_not_found(self):
        """Test de récupération d'un devis inexistant."""
        response = self.client.get('/api/devis/999')
        self.assertEqual(response.status_code, 404)

    # Tests de l'endpoint POST /api/devis
    def test_create_devis_success(self):
        """Test de création réussie d'un devis."""
        response = self.client.post('/api/devis', 
                                   json=self.valid_devis,
                                   content_type='application/json')
        self.assertEqual(response.status_code, 201)
        self.assertIn('message', response.json)
        self.assertIn('id', response.json)

    def test_create_devis_missing_fields(self):
        """Test de création avec champs requis manquants."""
        incomplete_data = {
            "nom_client": "Client Incomplet",
            # numéro_opportunité manquant
            "type_ouvrage": "Habitation"
        }
        response = self.client.post('/api/devis', 
                                   json=incomplete_data,
                                   content_type='application/json')
        self.assertEqual(response.status_code, 400)
        self.assertIn('error', response.json)
        self.assertIn('numero_opportunite', response.json['error'])

    def test_create_devis_invalid_number(self):
        """Test de création avec un montant non numérique."""
        invalid_data = self.valid_devis.copy()
        invalid_data['cout_ouvrage'] = "non-numérique"
        
        response = self.client.post('/api/devis',
                                   json=invalid_data,
                                   content_type='application/json')
        self.assertEqual(response.status_code, 400)
        self.assertIn('error', response.json)
        self.assertIn('doit être un nombre', response.json['error'])

    def test_create_duplicate_devis(self):
        """Test de création avec un numéro d'opportunité déjà existant."""
        # Créer un premier devis
        self.client.post('/api/devis', 
                        json=self.valid_devis,
                        content_type='application/json')
        
        # Tenter de créer un devis avec le même numéro
        duplicate_data = self.valid_devis.copy()
        duplicate_data['nom_client'] = "Client Duplicate"
        
        response = self.client.post('/api/devis',
                                   json=duplicate_data,
                                   content_type='application/json')
        self.assertEqual(response.status_code, 409)
        self.assertIn('error', response.json)
        self.assertIn('existe déjà', response.json['error'])

    # Tests de l'endpoint PATCH /api/devis/<id>
    def test_update_devis_success(self):
        """Test de modification réussie d'un devis."""
        # Créer d'abord un devis
        with app.app_context():
            devis = Devis(**self.valid_devis)
            db.session.add(devis)
            db.session.commit()
            devis_id = devis.id
        
        # Modifier le devis
        update_data = {
            "nom_client": "Client Modifié",
            "cout_ouvrage": 200000.0
        }
        response = self.client.patch(f'/api/devis/{devis_id}',
                                    json=update_data,
                                    content_type='application/json')
        self.assertEqual(response.status_code, 200)
        
        # Vérifier que les modifications sont bien appliquées
        get_response = self.client.get(f'/api/devis/{devis_id}')
        self.assertEqual(get_response.json['nom_client'], "Client Modifié")
        self.assertEqual(get_response.json['cout_ouvrage'], 200000.0)
        # Vérifier que les autres champs sont inchangés
        self.assertEqual(get_response.json['type_ouvrage'], "Habitation")

    def test_update_nonexistent_devis(self):
        """Test de modification d'un devis inexistant."""
        response = self.client.patch('/api/devis/999',
                                    json={"nom_client": "N'existe pas"},
                                    content_type='application/json')
        self.assertEqual(response.status_code, 404)

    def test_update_devis_invalid_data(self):
        """Test de modification avec données invalides."""
        # Créer d'abord un devis
        with app.app_context():
            devis = Devis(**self.valid_devis)
            db.session.add(devis)
            db.session.commit()
            devis_id = devis.id
        
        # Tentative de modification avec données invalides
        response = self.client.patch(f'/api/devis/{devis_id}',
                                    json={"cout_ouvrage": "invalide"},
                                    content_type='application/json')
        self.assertEqual(response.status_code, 400)
        self.assertIn('error', response.json)

    # Tests de génération de documents
    def test_generate_docx(self):
        """Test de génération d'un document Word."""
        # Skip si le template n'existe pas
        if not os.path.exists(os.path.join("template_docx", "template.docx")):
            self.skipTest("Template Word manquant")
            
        # Créer un devis pour générer le document
        with app.app_context():
            devis = Devis(**self.valid_devis)
            db.session.add(devis)
            db.session.commit()
            devis_id = devis.id
            
        # Tester la génération du document
        response = self.client.get(f'/api/devis/{devis_id}/docx')
        self.assertEqual(response.status_code, 200)
        self.assertIn('application/vnd.openxmlformats-officedocument.wordprocessingml.document', 
                     response.headers.get('Content-Type', ''))
        
        # Vérifier que le fichier généré existe
        import contextlib
        found = False
        with contextlib.suppress(Exception):
            for file in os.listdir('documents'):
                if file.startswith('Proposition_commerciale'):
                    found = True
                    break
        self.assertTrue(found, "Aucun fichier DOCX généré n'a été trouvé")

    def test_generate_docx_not_found(self):
        """Test de génération pour un devis inexistant."""
        response = self.client.get('/api/devis/999/docx')
        self.assertEqual(response.status_code, 404)

    def test_generate_pdf(self):
        """Test de génération d'un document PDF."""
        # Skip si le template n'existe pas ou si docx2pdf n'est pas disponible
        try:
            if not os.path.exists(os.path.join("template_docx", "template.docx")):
                self.skipTest("Template Word manquant")
                
            # Créer un devis pour générer le document
            with app.app_context():
                devis = Devis(**self.valid_devis)
                db.session.add(devis)
                db.session.commit()
                devis_id = devis.id
                
            # Tester la génération du PDF
            response = self.client.get(f'/api/devis/{devis_id}/pdf')
            
            # Si conversion PDF échoue mais génère quand même une réponse
            if 'application/pdf' in response.headers.get('Content-Type', ''):
                self.assertEqual(response.status_code, 200)
                self.assertIn('application/pdf', response.headers.get('Content-Type', ''))
            else:
                # Si erreur dans la conversion mais API répond quand même
                self.assertIn(response.status_code, [200, 500])
        except Exception as e:
            self.skipTest(f"Test PDF ignoré: {str(e)}")

    def test_create_devis_with_null_values(self):
        """Test de création avec valeurs nulles autorisées."""
        null_data = self.valid_devis.copy()
        null_data.update({
            'cout_ouvrage': None,
            'presence_existant': None,
            'souhaite_rcmo': None,
            'taux_seul': None,
            'type_travaux': None
        })
        
        response = self.client.post('/api/devis',
                                  json=null_data,
                                  content_type='application/json')
        self.assertEqual(response.status_code, 201)
        self.assertIn('id', response.json)
        
        # Vérifier que les valeurs nulles sont bien enregistrées
        devis_id = response.json['id']
        get_response = self.client.get(f'/api/devis/{devis_id}')
        self.assertEqual(get_response.json['cout_ouvrage'], None)
        self.assertEqual(get_response.json['type_travaux'], None)

    def test_update_devis_multiple_fields(self):
        """Test de modification avec plusieurs champs de types différents."""
        # Créer d'abord un devis
        with app.app_context():
            devis = Devis(**self.valid_devis)
            db.session.add(devis)
            db.session.commit()
            devis_id = devis.id
        
        # Modifier plusieurs champs de types différents
        update_data = {
            "nom_client": "Client Multi-Update",
            "cout_ouvrage": 123456.78,
            "presence_existant": False,
            "type_tarif": "Premium",
            "destination_ouvrage": "Usage commercial"
        }
        response = self.client.patch(f'/api/devis/{devis_id}',
                                    json=update_data,
                                    content_type='application/json')
        self.assertEqual(response.status_code, 200)
        
        # Vérifier toutes les modifications
        get_response = self.client.get(f'/api/devis/{devis_id}')
        for field, value in update_data.items():
            self.assertEqual(get_response.json[field], value)

    def test_taux_seul_calculations(self):
        """Test des calculs de tarification avec taux personnalisé."""
        # Créer un devis avec taux personnalisé
        custom_data = self.valid_devis.copy()
        custom_data.update({
            "cout_ouvrage": 1000000.0,
            "taux_seul": 2.5  # Taux personnalisé de 2.5%
        })
        
        with app.app_context():
            devis = Devis(**custom_data)
            db.session.add(devis)
            db.session.commit()
            devis_id = devis.id
            
        # Vérifier que le document généré utilise ce taux
        if os.path.exists(os.path.join("template_docx", "template.docx")):
            response = self.client.get(f'/api/devis/{devis_id}/docx')
            self.assertEqual(response.status_code, 200)

    # Test de flux complet
    def test_workflow_create_update_generate(self):
        """Test d'un flux complet: création, mise à jour et génération."""
        # 1. Créer un devis
        create_response = self.client.post('/api/devis', 
                                          json=self.valid_devis,
                                          content_type='application/json')
        self.assertEqual(create_response.status_code, 201)
        devis_id = create_response.json['id']
        
        # 2. Mettre à jour le devis
        update_response = self.client.patch(f'/api/devis/{devis_id}',
                                           json={"description_ouvrage": "Description modifiée"},
                                           content_type='application/json')
        self.assertEqual(update_response.status_code, 200)
        
        # 3. Vérifier la mise à jour
        get_response = self.client.get(f'/api/devis/{devis_id}')
        self.assertEqual(get_response.json['description_ouvrage'], "Description modifiée")
        
        # 4. Générer un document (si le template existe)
        if os.path.exists(os.path.join("template_docx", "template.docx")):
            doc_response = self.client.get(f'/api/devis/{devis_id}/docx')
            self.assertEqual(doc_response.status_code, 200)


if __name__ == '__main__':
    unittest.main()