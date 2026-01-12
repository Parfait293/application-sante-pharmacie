# Backend - Santé Pharmacie

Backend API pour l'application Santé Pharmacie, développée avec Node.js, Express et MongoDB.

## Installation

1. Installer les dépendances :
```bash
cd backend
npm install
```

2. Configurer les variables d'environnement :
   - Copier `.env` et modifier les valeurs
   - `MONGO_URI` : URL de connexion MongoDB
   - `JWT_SECRET` : Clé secrète pour JWT
   - `PORT` : Port du serveur (défaut 5000)

3. Démarrer MongoDB localement ou utiliser une instance cloud (MongoDB Atlas)

4. Lancer le serveur :
```bash
npm start
# ou en mode développement
npm run dev
```

## API Endpoints

### Authentification
- `POST /api/auth/register` - Inscription
- `POST /api/auth/login` - Connexion
- `GET /api/auth/me` - Profil utilisateur
- `POST /api/auth/refresh` - Rafraîchir token

### Utilisateurs
- `PUT /api/users/profile` - Mettre à jour profil
- `PUT /api/users/wallet` - Mettre à jour portefeuille
- `PUT /api/users/password` - Changer mot de passe

### Pharmacies
- `GET /api/pharmacies` - Liste des pharmacies
- `GET /api/pharmacies/:id` - Détails pharmacie
- `GET /api/pharmacies/search/:medicine` - Recherche par médicament

### Médicaments
- `GET /api/medicines/search?name=...` - Recherche médicaments (RxNorm API)

### Rendez-vous
- `GET /api/appointments` - Rendez-vous utilisateur
- `POST /api/appointments` - Créer rendez-vous
- `PUT /api/appointments/:id` - Modifier rendez-vous

### Commandes
- `GET /api/orders` - Commandes utilisateur
- `POST /api/orders` - Créer commande
- `PUT /api/orders/:id` - Modifier commande

### Notifications
- `GET /api/notifications` - Notifications utilisateur
- `PUT /api/notifications/:id/read` - Marquer comme lu
- `PUT /api/notifications/read-all` - Tout marquer comme lu

## Modèles de données

- **User** : Utilisateurs avec profil, portefeuille
- **Pharmacy** : Pharmacies avec médicaments disponibles
- **Professional** : Professionnels de santé
- **Appointment** : Rendez-vous médicaux
- **Order** : Commandes de médicaments
- **Notification** : Notifications système

## Sécurité

- Authentification JWT
- Hashage des mots de passe (bcrypt)
- Validation des entrées
- Gestion des erreurs

## Fonctionnalités

- Géolocalisation pour tri des pharmacies
- Upload de fichiers (photos de profil, ordonnances)
- Intégration API externe (RxNorm)
- Système de paiement simulé
- Notifications temps réel

## Développement

Pour ajouter de nouvelles fonctionnalités :
1. Créer/modifier les modèles dans `/models`
2. Ajouter les routes dans `/routes`
3. Importer les routes dans `server.js`
4. Tester avec Postman ou l'application frontend