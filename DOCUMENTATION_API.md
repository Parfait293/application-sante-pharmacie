# Documentation Complète des API - Application Santé Pharmacie

## Table des Matières

1. [Configuration Générale](#configuration-générale)
2. [API d'Authentification](#api-dauthentification)
3. [API Utilisateurs](#api-utilisateurs)
4. [API Paiements](#api-paiements)
5. [API Pharmacies](#api-pharmacies)
6. [API Médicaments](#api-médicaments)
7. [API Rendez-vous](#api-rendez-vous)
8. [API Commandes](#api-commandes)
9. [API Notifications](#api-notifications)
10. [API Professionnels](#api-professionnels)
11. [API Manquantes Suggérées](#api-manquantes-suggérées)

---

## Configuration Générale

### Base URL
```
http://localhost:5000/api
```

### En-têtes requis
```json
{
  "Content-Type": "application/json",
  "Authorization": "Bearer <token_jwt>"
}
```

### Variables d'environnement
```env
MONGO_URI=your_mongodb_connection_string
JWT_SECRET=your_jwt_secret_key
PORT=5000
MOOV_API_URL=https://api.moov.tg
MOOV_API_KEY=your_moov_api_key
YAS_API_URL=https://api.yas.tg
YAS_API_KEY=your_yas_api_key
RXNAV_API_BASE=https://rxnav.nlm.nih.gov
```

---

## API d'Authentification

### POST /auth/register
**Description**: Inscription d'un nouvel utilisateur

**Corps de la requête**:
```json
{
  "nom": "Dupont",
  "prenom": "Jean",
  "telephone": "+22812345678",
  "profession": "Ingénieur",
  "email": "jean.dupont@email.com",
  "password": "password123"
}
```

**Réponse**:
```json
{
  "message": "User registered successfully",
  "token": "jwt_token_here",
  "user": {
    "id": "user_id",
    "nom": "Dupont",
    "prenom": "Jean",
    "telephone": "+22812345678",
    "profession": "Ingénieur",
    "email": "jean.dupont@email.com",
    "photo": null,
    "walletBalance": 0
  }
}
```

### POST /auth/login
**Description**: Connexion utilisateur

**Corps de la requête**:
```json
{
  "identifier": "jean.dupont@email.com",
  "password": "password123"
}
```

**Réponse**:
```json
{
  "message": "Login successful",
  "token": "jwt_token_here",
  "user": {
    "id": "user_id",
    "nom": "Dupont",
    "prenom": "Jean",
    "telephone": "+22812345678",
    "profession": "Ingénieur",
    "email": "jean.dupont@email.com",
    "photo": null,
    "walletBalance": 5000
  }
}
```

### GET /auth/me
**Description**: Obtenir les informations de l'utilisateur connecté

**Réponse**:
```json
{
  "user": {
    "id": "user_id",
    "nom": "Dupont",
    "prenom": "Jean",
    "email": "jean.dupont@email.com",
    "walletBalance": 5000
  }
}
```

### POST /auth/refresh
**Description**: Rafraîchir le token JWT

**Réponse**:
```json
{
  "token": "new_jwt_token_here"
}
```

---

## API Utilisateurs

### PUT /users/profile
**Description**: Mettre à jour le profil utilisateur

**Corps de la requête**:
```json
{
  "nom": "Dupont",
  "prenom": "Jean",
  "telephone": "+22812345678",
  "profession": "Ingénieur",
  "email": "jean.dupont@email.com",
  "photo": "data:image/jpeg;base64,/9j/4AAQSkZJRgABAQAAAQ..."
}
```

**Réponse**:
```json
{
  "message": "Profile updated successfully",
  "user": {
    "id": "user_id",
    "nom": "Dupont",
    "prenom": "Jean",
    "photo": "base64_image_data"
  }
}
```

### PUT /users/wallet
**Description**: Mettre à jour le solde du portefeuille

**Corps de la requête**:
```json
{
  "amount": 5000,
  "operation": "add"
}
```

**Réponse**:
```json
{
  "message": "Wallet updated successfully",
  "user": {
    "walletBalance": 10000
  }
}
```

### PUT /users/password
**Description**: Changer le mot de passe

**Corps de la requête**:
```json
{
  "currentPassword": "old_password",
  "newPassword": "new_password"
}
```

**Réponse**:
```json
{
  "message": "Password changed successfully"
}
```

### GET /users/:id
**Description**: Obtenir les informations d'un utilisateur par ID

**Réponse**:
```json
{
  "user": {
    "id": "user_id",
    "nom": "Dupont",
    "prenom": "Jean",
    "profession": "Ingénieur"
  }
}
```

---

## API Paiements

### POST /payments/methods
**Description**: Ajouter une méthode de paiement

**Corps de la requête**:
```json
{
  "method": "moov",
  "phoneNumber": "+22812345678",
  "isDefault": true
}
```

**Réponse**:
```json
{
  "message": "Méthode de paiement ajoutée",
  "payment": {
    "id": "payment_id",
    "method": "moov",
    "phoneNumber": "+22812345678",
    "isDefault": true,
    "isVerified": true
  }
}
```

### GET /payments/methods
**Description**: Obtenir les méthodes de paiement de l'utilisateur

**Réponse**:
```json
{
  "payments": [
    {
      "id": "payment_id",
      "method": "moov",
      "phoneNumber": "+22812345678",
      "isDefault": true,
      "isVerified": true
    }
  ]
}
```

### DELETE /payments/methods/:id
**Description**: Supprimer une méthode de paiement

**Réponse**:
```json
{
  "message": "Méthode de paiement supprimée"
}
```

### POST /payments/deposit
**Description**: Déposer de l'argent via opérateur mobile

**Corps de la requête**:
```json
{
  "amount": 10000,
  "method": "moov",
  "phoneNumber": "+22812345678"
}
```

**Réponse**:
```json
{
  "message": "Demande de dépôt initiée",
  "transaction": {
    "id": "transaction_id",
    "reference": "DEP_1640995200000_abc123def",
    "amount": 9800,
    "status": "pending"
  }
}
```

### POST /payments/pay
**Description**: Effectuer un paiement (consultation, médicaments)

**Corps de la requête**:
```json
{
  "amount": 5000,
  "description": "Consultation médicale",
  "type": "consultation",
  "relatedId": "appointment_id"
}
```

**Réponse**:
```json
{
  "message": "Paiement effectué",
  "transaction": {
    "id": "transaction_id",
    "type": "consultation",
    "amount": -5000,
    "status": "completed",
    "description": "Consultation médicale"
  }
}
```

### GET /payments/transactions
**Description**: Obtenir l'historique des transactions

**Paramètres de requête**:
- `page`: numéro de page (défaut: 1)
- `limit`: nombre par page (défaut: 20)
- `type`: type de transaction (optionnel)

**Réponse**:
```json
{
  "transactions": [
    {
      "id": "transaction_id",
      "type": "deposit",
      "amount": 10000,
      "status": "completed",
      "description": "Dépôt via Moov Money",
      "createdAt": "2023-12-01T10:00:00.000Z"
    }
  ],
  "pagination": {
    "page": 1,
    "limit": 20,
    "total": 50,
    "pages": 3
  }
}
```

### GET /payments/transactions/:id
**Description**: Obtenir les détails d'une transaction

**Réponse**:
```json
{
  "transaction": {
    "id": "transaction_id",
    "type": "deposit",
    "amount": 10000,
    "status": "completed",
    "description": "Dépôt via Moov Money"
  }
}
```

---

## API Pharmacies

### GET /pharmacies
**Description**: Obtenir la liste des pharmacies

**Paramètres de requête**:
- `medicine`: filtrer par médicament disponible
- `lat`: latitude utilisateur
- `lng`: longitude utilisateur

**Réponse**:
```json
{
  "pharmacies": [
    {
      "id": "pharmacy_id",
      "name": "Pharmacie Centrale",
      "address": "123 Rue Principale",
      "lat": 6.123456,
      "lng": 1.234567,
      "availableMedicines": ["paracetamol", "ibuprofene"],
      "distance": 2.5,
      "isActive": true
    }
  ]
}
```

### GET /pharmacies/:id
**Description**: Obtenir les détails d'une pharmacie

**Réponse**:
```json
{
  "pharmacy": {
    "id": "pharmacy_id",
    "name": "Pharmacie Centrale",
    "address": "123 Rue Principale",
    "lat": 6.123456,
    "lng": 1.234567,
    "availableMedicines": ["paracetamol", "ibuprofene"],
    "isActive": true
  }
}
```

### GET /pharmacies/search/:medicine
**Description**: Rechercher des pharmacies par médicament

**Réponse**:
```json
{
  "pharmacies": [
    {
      "id": "pharmacy_id",
      "name": "Pharmacie Centrale",
      "address": "123 Rue Principale",
      "availableMedicines": ["paracetamol"]
    }
  ]
}
```

---

## API Médicaments

### GET /medicines/search
**Description**: Rechercher des médicaments (API RxNorm)

**Paramètres de requête**:
- `name`: nom du médicament (minimum 3 caractères)

**Réponse**:
```json
{
  "medicines": [
    "Paracetamol 500mg",
    "Paracetamol 1000mg",
    "Paracetamol Syrup"
  ]
}
```

### GET /medicines/:name
**Description**: Obtenir les détails d'un médicament

**Réponse**:
```json
{
  "name": "Paracetamol",
  "description": "Information sur Paracetamol"
}
```

---

## API Rendez-vous

### GET /appointments
**Description**: Obtenir les rendez-vous de l'utilisateur

**Réponse**:
```json
{
  "appointments": [
    {
      "id": "appointment_id",
      "professional": {
        "id": "professional_id",
        "name": "Dr. Dupont",
        "specialty": "Médecine générale"
      },
      "date": "2023-12-15",
      "time": "14:30",
      "type": "consultation",
      "status": "confirmed",
      "consultationFee": 5000,
      "isPaid": false
    }
  ]
}
```

### POST /appointments
**Description**: Créer un rendez-vous

**Corps de la requête**:
```json
{
  "professionalId": "professional_id",
  "date": "2023-12-15",
  "time": "14:30",
  "type": "consultation",
  "notes": "Consultation pour douleur"
}
```

**Réponse**:
```json
{
  "message": "Appointment created successfully",
  "appointment": {
    "id": "appointment_id",
    "professional": {
      "name": "Dr. Dupont",
      "specialty": "Médecine générale"
    },
    "date": "2023-12-15",
    "time": "14:30",
    "status": "confirmed"
  }
}
```

### PUT /appointments/:id
**Description**: Mettre à jour un rendez-vous

**Corps de la requête**:
```json
{
  "status": "completed",
  "confirmPayment": true
}
```

**Réponse**:
```json
{
  "message": "Appointment updated successfully",
  "appointment": {
    "id": "appointment_id",
    "status": "completed",
    "isPaid": true
  }
}
```

### GET /appointments/:id
**Description**: Obtenir les détails d'un rendez-vous

**Réponse**:
```json
{
  "appointment": {
    "id": "appointment_id",
    "professional": {
      "name": "Dr. Dupont",
      "specialty": "Médecine générale"
    },
    "date": "2023-12-15",
    "time": "14:30",
    "status": "confirmed"
  }
}
```

---

## API Commandes

### GET /orders
**Description**: Obtenir les commandes de l'utilisateur

**Réponse**:
```json
{
  "orders": [
    {
      "id": "order_id",
      "pharmacy": {
        "id": "pharmacy_id",
        "name": "Pharmacie Centrale"
      },
      "medication": "Paracetamol 500mg",
      "quantity": 2,
      "price": 10000,
      "status": "pending",
      "deliveryAddress": "123 Rue Principale",
      "createdAt": "2023-12-01T10:00:00.000Z"
    }
  ]
}
```

### POST /orders
**Description**: Créer une commande (multipart/form-data)

**Champs du formulaire**:
- `pharmacyId`: ID de la pharmacie
- `medication`: nom du médicament
- `quantity`: quantité
- `deliveryAddress`: adresse de livraison
- `notes`: notes optionnelles
- `prescription`: fichier d'ordonnance (image/PDF)

**Réponse**:
```json
{
  "message": "Order created successfully",
  "order": {
    "id": "order_id",
    "pharmacy": {
      "name": "Pharmacie Centrale"
    },
    "medication": "Paracetamol 500mg",
    "quantity": 2,
    "price": 10000,
    "status": "pending"
  }
}
```

### PUT /orders/:id
**Description**: Mettre à jour le statut d'une commande

**Corps de la requête**:
```json
{
  "status": "cancelled"
}
```

**Réponse**:
```json
{
  "message": "Order updated successfully",
  "order": {
    "id": "order_id",
    "status": "cancelled"
  }
}
```

### GET /orders/:id
**Description**: Obtenir les détails d'une commande

**Réponse**:
```json
{
  "order": {
    "id": "order_id",
    "pharmacy": {
      "name": "Pharmacie Centrale"
    },
    "medication": "Paracetamol 500mg",
    "quantity": 2,
    "price": 10000,
    "status": "pending"
  }
}
```

---

## API Notifications

### GET /notifications
**Description**: Obtenir les notifications de l'utilisateur

**Réponse**:
```json
{
  "notifications": [
    {
      "id": "notification_id",
      "title": "Rappel de rendez-vous",
      "message": "Vous avez un rendez-vous demain à 14h30",
      "type": "appointment",
      "isRead": false,
      "createdAt": "2023-12-01T10:00:00.000Z"
    }
  ]
}
```

### PUT /notifications/:id/read
**Description**: Marquer une notification comme lue

**Réponse**:
```json
{
  "message": "Notification marked as read"
}
```

### PUT /notifications/read-all
**Description**: Marquer toutes les notifications comme lues

**Réponse**:
```json
{
  "message": "All notifications marked as read"
}
```

### POST /notifications
**Description**: Créer une notification (usage interne)

**Corps de la requête**:
```json
{
  "userId": "user_id",
  "title": "Nouveau message",
  "message": "Vous avez reçu un nouveau message",
  "type": "message",
  "data": {}
}
```

**Réponse**:
```json
{
  "notification": {
    "id": "notification_id",
    "title": "Nouveau message",
    "message": "Vous avez reçu un nouveau message"
  }
}
```

### DELETE /notifications/:id
**Description**: Supprimer une notification

**Réponse**:
```json
{
  "message": "Notification deleted"
}
```

---

## API Professionnels

### GET /professionals/profile
**Description**: Obtenir le profil et le solde du professionnel

**Réponse**:
```json
{
  "professional": {
    "id": "professional_id",
    "name": "Dr. Dupont",
    "specialty": "Médecine générale",
    "email": "dr.dupont@email.com",
    "consultationFee": 5000
  },
  "walletBalance": 50000
}
```

### GET /professionals/transactions
**Description**: Obtenir les gains/transactions du professionnel

**Paramètres de requête**:
- `page`: numéro de page (défaut: 1)
- `limit`: nombre par page (défaut: 20)

**Réponse**:
```json
{
  "transactions": [
    {
      "id": "transaction_id",
      "type": "consultation",
      "amount": 5000,
      "status": "completed",
      "description": "Consultation Médecine générale",
      "createdAt": "2023-12-01T10:00:00.000Z"
    }
  ],
  "totalEarnings": 50000
}
```

### POST /professionals/withdraw
**Description**: Retirer les gains

**Corps de la requête**:
```json
{
  "amount": 20000,
  "bankDetails": {
    "bankName": "Ecobank",
    "accountNumber": "1234567890",
    "accountName": "Dr. Dupont"
  }
}
```

**Réponse**:
```json
{
  "message": "Demande de retrait initiée",
  "transaction": {
    "id": "transaction_id",
    "type": "withdrawal",
    "amount": -20000,
    "status": "pending"
  }
}
```

### GET /professionals/appointments
**Description**: Obtenir les rendez-vous du professionnel

**Réponse**:
```json
{
  "appointments": [
    {
      "id": "appointment_id",
      "user": {
        "nom": "Dupont",
        "prenom": "Jean",
        "telephone": "+22812345678"
      },
      "date": "2023-12-15",
      "time": "14:30",
      "status": "confirmed",
      "isPaid": false
    }
  ]
}
```

---

## API Manquantes Suggérées

### 1. API de Gestion des Stocks Pharmaceutiques

#### GET /pharmacies/:id/inventory
**Description**: Obtenir l'inventaire complet d'une pharmacie

**Réponse attendue**:
```json
{
  "inventory": [
    {
      "medicine": "Paracetamol 500mg",
      "quantity": 50,
      "price": 2500,
      "expiryDate": "2024-12-31",
      "category": "Antalgique"
    }
  ]
}
```

#### PUT /pharmacies/:id/inventory
**Description**: Mettre à jour l'inventaire de la pharmacie

**Corps de la requête**:
```json
{
  "medicine": "Paracetamol 500mg",
  "quantity": 45,
  "price": 2500
}
```

### 2. API de Livraison

#### GET /deliveries
**Description**: Obtenir les livraisons en cours

**Réponse attendue**:
```json
{
  "deliveries": [
    {
      "id": "delivery_id",
      "orderId": "order_id",
      "deliveryPerson": "Livreur Name",
      "status": "in_transit",
      "estimatedTime": "30 minutes",
      "location": {
        "lat": 6.123456,
        "lng": 1.234567
      }
    }
  ]
}
```

#### PUT /deliveries/:id/status
**Description**: Mettre à jour le statut de livraison

**Corps de la requête**:
```json
{
  "status": "delivered",
  "signature": "base64_signature"
}
```

### 3. API d'Évaluations et Avis

#### POST /reviews
**Description**: Ajouter une évaluation pour un professionnel ou une pharmacie

**Corps de la requête**:
```json
{
  "targetType": "professional",
  "targetId": "professional_id",
  "rating": 5,
  "comment": "Excellent service",
  "appointmentId": "appointment_id"
}
```

#### GET /professionals/:id/reviews
**Description**: Obtenir les évaluations d'un professionnel

**Réponse attendue**:
```json
{
  "reviews": [
    {
      "id": "review_id",
      "user": {
        "nom": "Dupont",
        "prenom": "Jean"
      },
      "rating": 5,
      "comment": "Excellent service",
      "createdAt": "2023-12-01T10:00:00.000Z"
    }
  ],
  "averageRating": 4.8,
  "totalReviews": 25
}
```

### 4. API de Messagerie

#### GET /conversations
**Description**: Obtenir les conversations de l'utilisateur

**Réponse attendue**:
```json
{
  "conversations": [
    {
      "id": "conversation_id",
      "participant": {
        "id": "professional_id",
        "name": "Dr. Dupont",
        "photo": "profile_photo_url"
      },
      "lastMessage": {
        "content": "Bonjour, comment allez-vous?",
        "timestamp": "2023-12-01T10:00:00.000Z",
        "sender": "professional"
      },
      "unreadCount": 2
    }
  ]
}
```

#### POST /conversations/:id/messages
**Description**: Envoyer un message dans une conversation

**Corps de la requête**:
```json
{
  "content": "Merci pour la consultation",
  "type": "text"
}
```

### 5. API de Télémédecine

#### POST /consultations/video
**Description**: Démarrer une consultation vidéo

**Corps de la requête**:
```json
{
  "professionalId": "professional_id",
  "appointmentId": "appointment_id"
}
```

**Réponse attendue**:
```json
{
  "session": {
    "id": "session_id",
    "token": "video_token",
    "roomId": "room_12345",
    "expiresAt": "2023-12-01T11:00:00.000Z"
  }
}
```

### 6. API d'Urgences

#### GET /emergency/nearby
**Description**: Trouver les services d'urgence à proximité

**Paramètres de requête**:
- `lat`: latitude
- `lng`: longitude
- `type`: type d'urgence (hospital, pharmacy, clinic)

**Réponse attendue**:
```json
{
  "services": [
    {
      "id": "emergency_id",
      "name": "Hôpital Central",
      "type": "hospital",
      "address": "123 Rue Urgence",
      "phone": "+22812345678",
      "distance": 2.5,
      "is24h": true,
      "services": ["urgence", "maternité", "chirurgie"]
    }
  ]
}
```

### 7. API d'Assurance Santé

#### GET /insurance/coverage
**Description**: Vérifier la couverture d'assurance

**Paramètres de requête**:
- `insuranceId`: ID de l'assurance
- `serviceType`: type de service

**Réponse attendue**:
```json
{
  "coverage": {
    "percentage": 80,
    "maxAmount": 50000,
    "deductible": 5000,
    "conditions": ["ordonnance requise", "pré-autorisation"]
  }
}
```

### 8. API de Rapports et Statistiques

#### GET /analytics/user/dashboard
**Description**: Obtenir le tableau de bord utilisateur

**Réponse attendue**:
```json
{
  "dashboard": {
    "totalSpent": 150000,
    "appointmentsCount": 5,
    "ordersCount": 12,
    "upcomingAppointments": 2,
    "healthScore": 85,
    "recentActivity": [
      {
        "type": "appointment",
        "description": "Consultation avec Dr. Dupont",
        "date": "2023-12-01"
      }
    ]
  }
}
```

### 9. API de Gestion Familiale

#### GET /family/members
**Description**: Obtenir les membres de la famille

**Réponse attendue**:
```json
{
  "members": [
    {
      "id": "member_id",
      "name": "Marie Dupont",
      "relationship": "épouse",
      "birthDate": "1985-05-15",
      "bloodType": "A+",
      "allergies": ["pénicilline"],
      "permissions": ["view_appointments", "book_appointments"]
    }
  ]
}
```

### 10. API de Rappels Médicaux

#### POST /reminders
**Description**: Créer un rappel médical

**Corps de la requête**:
```json
{
  "type": "medication",
  "title": "Prise de médicament",
  "description": "Paracetamol 500mg - 1 comprimé",
  "frequency": "daily",
  "time": ["08:00", "20:00"],
  "startDate": "2023-12-01",
  "endDate": "2023-12-07"
}
```

---

## Conclusion

Cette documentation couvre toutes les API actuellement implémentées dans l'application Santé Pharmacie, ainsi que des suggestions pour les API manquantes qui pourraient améliorer considérablement la fonctionnalité et l'expérience utilisateur de la plateforme.

Les API suggérées ajoutent des fonctionnalités essentielles telles que:
- Gestion complète des stocks pharmaceutiques
- Suivi des livraisons en temps réel
- Système d'évaluation et d'avis
- Messagerie intégrée
- Télémédecine
- Services d'urgence
- Gestion d'assurance santé
- Analytics et rapports
- Gestion familiale
- Rappels médicaux intelligents

L'implémentation de ces API permettrait à l'application de devenir une plateforme de santé complète et intégrée.
