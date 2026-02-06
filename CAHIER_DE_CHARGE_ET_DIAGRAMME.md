 Application Santé Pharmacie - Cahier de Charge et Diagramme de Cas d'Utilisation

**Date :** 6 février 2026  
**Projet :** Application Santé Pharmacie  
**Type de document :** Cahier de charge technique + Diagramme de cas d'utilisation  
**Version :** 2.0 (Mise à jour avec interfaces Professionnel et Admin)

---

## 1. DIAGRAMME DE CAS D'UTILISATION (UML)

```
┌─────────────────────────────────────────────────────────────────────────────────────────┐
│                          APPLICATION SANTÉ PHARMACIE                                    │
├─────────────────────────────────────────────────────────────────────────────────────────┤
│                                                                                         │
│                                  ┌──────────────────┐                                  │
│                                  │    UTILISATEUR   │                                  │
│                                  │   (Patient)      │                                  │
│                                  └──────────────────┘                                  │
│                                         │                                              │
│                        ┌────────────────┼────────────────┐                            │
│                        │                │                │                            │
│                    ╱───▼───╲         ╱──▼───╲         ╱─▼────╲                       │
│                   │VISITEUR │        │PATIENT │        │  ADMIN │                     │
│                   │(Guest)  │        │ (User) │        │        │                     │
│                    ╲───────╱         ╲──────╱         ╲──────╱                       │
│                        │                │                │                            │
│              ┌─────────┴────────────────┼────────────────┴──────────┐                │
│              │                          │                           │                │
│      ┌───────▼────────┐        ┌────────▼────────┐        ┌────────▼───────┐       │
│      │ S'inscrire     │        │ S'authentifier  │        │ Gérer l'app    │       │
│      │ (Register)     │        │ (Login)         │        │ (Admin panel)  │       │
│      └────────────────┘        └────────────────┘        └────────────────┘       │
│                                        │                                            │
│              ┌─────────────────────────┴──────────────────────────┐               │
│              │                                                    │               │
│              ▼                                                    ▼               │
│    ┌──────────────────────┐                              ┌───────────────────┐   │
│    │   CAS D'UTILISATION  │                              │ PROFESSIONNEL DE  │   │
│    │   POUR PATIENTS      │                              │ SANTÉ (Doctor)    │   │
│    └──────────────────────┘                              └───────────────────┘   │
│              │                                                    │                │
│         ┌────┴────────────────────────┬─────────────────┬────────┴───────┐       │
│         │                             │                 │                │       │
│         ▼                             ▼                 ▼                ▼       │
│ ┌─────────────────────────┐   ┌──────────────────┐ ┌──────────────┐ ┌──────┐   │
│ │ 1. Consulter Pharmacies │   │ 2. Consultation  │ │ 3. Commander │ │4.Pay │   │
│ │    - Afficher liste     │   │    - Prendre RDV │ │ Médicaments  │ │      │   │
│ │    - Filtrer/Chercher   │   │    - Appel Video │ │  - Ajouter   │ │Wallet│   │
│ │    - Voir détails       │   │    - Chat        │ │  - Valider   │ │      │   │
│ │    - Localisation       │   │    - Historique  │ │  - Tracer    │ │      │   │
│ │    - Pharmacies de Nuit │   │    - Facture     │ │              │ │      │   │
│ └─────────────────────────┘   └──────────────────┘ └──────────────┘ └──────┘   │
│         │                             │                 │                │       │
│         ▼                             ▼                 ▼                ▼       │
│ ┌─────────────────────────┐   ┌──────────────────┐ ┌──────────────┐ ┌──────┐   │
│ │ 5. Gérer Profil         │   │ 6. Historique    │ │ 7. Wallet    │ │8.Notif│  │
│ │  - Voir infos           │   │  - RDV passés    │ │ - Solde       │ │      │   │
│ │  - Modifier données     │   │  - Commandes     │ │ - Ajouter    │ │- Reçu │   │
│ │  - Changer mdp          │   │  - Paiements     │ │ - Retirer    │ │- Avis │   │
│ │  - Photo Profil         │   │  - Factures      │ │ - Historique │ │      │   │
│ │  - Gérer Adresses       │   │                  │ │              │ │      │   │
│ └─────────────────────────┘   └──────────────────┘ └──────────────┘ └──────┘   │
│                                                                                 │
│    ╔═══════════════════════════════════════════════════════════════════════╗   │
│    ║                 CAS POUR PROFESSIONNELS DE SANTÉ                      ║   │
│    ╚═══════════════════════════════════════════════════════════════════════╝   │
│                                                                                 │
│    ┌────────────────────────────┐  ┌──────────────────────┐  ┌────────────┐    │
│    │ A. Gérer Rendez-vous       │  │ B. Gestion Portefeuille  │C. Retrait  │    │
│    │  - Voir ses RDV            │  │  - Voir Transactions     │ Argent     │    │
│    │  - Confirmer/Annuler       │  │  - Historique Gains      │            │    │
│    │  - Ajouter Notes           │  │  - Solde Actuel          │            │    │
│    │  - Consulter Patient       │  │  - Statistiques          │            │    │
│    └────────────────────────────┘  └──────────────────────┘  └────────────┘    │
│                                                                                 │
└─────────────────────────────────────────────────────────────────────────────────┘
```

---

## 2. ACTEURS ET RÔLES

### 2.1 Visiteur (Guest/Non-authentifié)
- **Description :** Utilisateur non connecté à l'application
- **Droits :**
  - Consulter la page d'accueil
  - Voir les informations générales
  - Accéder à la page de login/signup
  - **Restrictions :** Accès limité aux fonctionnalités principales (pharmacies, consultation, commandes, portefeuille)

### 2.2 Patient (User/Authentifié)
- **Description :** Utilisateur enregistré et connecté
- **Droits :**
  - Consulter et filtrer les pharmacies
  - Rechercher des médicaments
  - Prendre rendez-vous avec des professionnels
  - Commander des médicaments
  - Effectuer des paiements
  - Gérer son portefeuille électronique
  - Consulter son historique
  - Recevoir et gérer les notifications
  - Mettre à jour son profil

### 2.3 Professionnel de Santé (Doctor/Specialist)
- **Description :** Médecin, pharmacien, infirmier ou autre professionnel de santé certifié
- **Droits :**
  - ✅ **Accès Hybride :** Tous les droits du Patient + fonctionnalités professionnelles
  - **Tableau de bord professionnel** avec statistiques et vue d'ensemble
  - **Gestion complète des rendez-vous** (confirmer, annuler, terminer, notes, ordonnances)
  - **Gestion du portefeuille professionnel** (gains, retraits, historique)
  - **Profil professionnel enrichi** (spécialité, cabinet, horaires, certifications)
  - **Accès patient** pour utiliser l'app comme un utilisateur normal
- **Processus d'inscription :**
  1. Formulaire d'inscription professionnel en 3 étapes
  2. Vérification des informations et certifications
  3. Validation par l'administrateur
  4. Accès automatique au tableau de bord professionnel

### 2.4 Administrateur (Admin)
- **Description :** Super-administrateur de la plateforme
- **Droits :**
  - **Accès admin sécurisé** par code d'accès
  - **Tableau de bord administratif** avec statistiques globales
  - **Gestion des utilisateurs** (activer/désactiver, supprimer, modifier)
  - **Supervision des professionnels** (validation, vérification)
  - **Vue d'ensemble de l'application** (utilisateurs, rendez-vous, revenus)
  - **Gestion des paramètres système**
- **Processus d'accès :**
  1. Page d'accès administrateur dédiée
  2. Saisie du code d'accès sécurisé
  3. Authentification et redirection vers le dashboard admin

---

## 3. CAS D'UTILISATION DÉTAILLÉS

### 3.1 CAS D'UTILISATION : Authentification

#### **UC-1 : S'inscrire (Register)**
- **Acteur Principal :** Visiteur
- **Description :** Un nouveau utilisateur crée un compte
- **Pré-conditions :** L'utilisateur n'a pas de compte existant
- **Flux Principal :**
  1. Utilisateur clique sur "S'inscrire"
  2. Renseigne nom, prénom, téléphone, profession
  3. Renseigne email et mot de passe
  4. Vérifie les conditions d'utilisation
  5. Clique sur "S'inscrire"
  6. Système crée le compte et authentifie l'utilisateur
  7. Redirection vers la page d'accueil
- **Post-conditions :** Compte créé, utilisateur authentifié et connecté
- **Endpoint API :** `POST /api/auth/register`
- **Modèle de données :** User
- **Erreurs possibles :**
  - Téléphone déjà utilisé
  - Email invalide
  - Mot de passe faible
  - Données manquantes

#### **UC-2 : Se connecter (Login)**
- **Acteur Principal :** Visiteur
- **Description :** L'utilisateur se connecte avec ses identifiants
- **Pré-conditions :** L'utilisateur a un compte existant
- **Flux Principal :**
  1. Utilisateur va sur la page Login
  2. Renseigne téléphone/email et mot de passe
  3. Clique sur "Se connecter"
  4. Système valide les identifiants
  5. Génère un token JWT
  6. Stocke le token en localStorage
  7. Redirection vers la page d'accueil
- **Post-conditions :** Utilisateur authentifié et connecté
- **Endpoint API :** `POST /api/auth/login`
- **Erreurs possibles :**
  - Identifiants incorrects
  - Compte inexistant
  - Compte désactivé

#### **UC-3 : Se déconnecter (Logout)**
- **Acteur Principal :** Patient/Professionnel
- **Description :** L'utilisateur se déconnecte de l'application
- **Flux Principal :**
  1. Utilisateur clique sur "Se déconnecter"
  2. Token supprimé de localStorage
  3. État utilisateur réinitialisé
  4. Redirection vers la page d'accueil
- **Post-conditions :** Utilisateur déconnecté

#### **UC-4 : Rafraîchir le token (Refresh)**
- **Acteur Principal :** Patient/Professionnel
- **Description :** Maintenir la session active en renouvelant le JWT
- **Endpoint API :** `POST /api/auth/refresh`
- **Flux :** Automatique lors de l'expiration du token

---

### 3.2 CAS D'UTILISATION : Gestion des Pharmacies

#### **UC-5 : Consulter la liste des pharmacies**
- **Acteur Principal :** Patient
- **Description :** L'utilisateur consulte les pharmacies disponibles
- **Pré-conditions :** Utilisateur authentifié
- **Flux Principal :**
  1. Utilisateur accède à la page "Pharmacies"
  2. Système affiche la liste des pharmacies
  3. Utilisateur peut filtrer par :
     - Localisation (géolocalisation)
     - Pharmacies de nuit/24h
     - Disponibilité de médicaments
  4. Clic sur une pharmacie pour voir les détails
- **Post-conditions :** Pharmacies affichées avec les informations
- **Endpoint API :** `GET /api/pharmacies`
- **Modèle de données :** Pharmacy
- **Champs affichés :**
  - Nom
  - Adresse
  - Téléphone
  - Statut "On-call" (pharmacie de nuit)
  - Localisation (lat, lng)
  - Médicaments disponibles

#### **UC-6 : Voir les détails d'une pharmacie**
- **Acteur Principal :** Patient
- **Description :** Afficher les informations détaillées d'une pharmacie
- **Flux Principal :**
  1. Utilisateur clique sur une pharmacie
  2. Système affiche :
     - Informations complètes
     - Liste des médicaments disponibles
     - Localisation sur carte
     - Horaires
     - Avis/Évaluations
- **Endpoint API :** `GET /api/pharmacies/:id`

#### **UC-7 : Rechercher des pharmacies par médicament**
- **Acteur Principal :** Patient
- **Description :** Trouver les pharmacies qui ont un médicament disponible
- **Flux Principal :**
  1. Utilisateur saisit le nom d'un médicament
  2. Clique sur "Rechercher"
  3. Système affiche les pharmacies qui ont ce médicament
  4. Les résultats sont triés par proximité
- **Endpoint API :** `GET /api/pharmacies/search/:medicine`

#### **UC-8 : Consulter les pharmacies de nuit**
- **Acteur Principal :** Patient
- **Description :** Afficher les pharmacies ouvertes 24h/24
- **Flux Principal :**
  1. Utilisateur clique sur "Pharmacies de Nuit"
  2. Système affiche les pharmacies avec `isOnCall: true`
  3. Tri par proximité géographique
- **Endpoint API :** `GET /api/pharmacies?onCall=true`

---

### 3.3 CAS D'UTILISATION : Gestion des Médicaments

#### **UC-9 : Rechercher un médicament**
- **Acteur Principal :** Patient
- **Description :** Trouver un médicament spécifique
- **Flux Principal :**
  1. Utilisateur saisit le nom du médicament
  2. Clique sur "Rechercher"
  3. Système interroge la base de données locale et l'API RxNorm
  4. Affiche les résultats avec détails
- **Endpoint API :** `GET /api/medicines/search?name=...`
- **Source :** API RxNorm pour données complètes sur les médicaments
- **Informations retournées :**
  - Nom
  - Dosage
  - Forme (comprimé, injection, etc.)
  - Fabricant
  - Prix approximatif

#### **UC-10 : Voir les détails d'un médicament**
- **Acteur Principal :** Patient
- **Description :** Afficher les informations complètes d'un médicament
- **Endpoint API :** `GET /api/medicines/:name`
- **Informations :**
  - Description
  - Posologie
  - Contre-indications
  - Effets secondaires
  - Pharmacies où il est disponible

---

### 3.4 CAS D'UTILISATION : Consultation Médicale

#### **UC-11 : Prendre rendez-vous avec un professionnel**
- **Acteur Principal :** Patient
- **Description :** Planifier une consultation médicale
- **Pré-conditions :** Utilisateur authentifié, portefeuille chargé
- **Flux Principal :**
  1. Utilisateur accède à "Consultation"
  2. Consulte la liste des professionnels disponibles
  3. Sélectionne un professionnel et une spécialité
  4. Choisit le type de consultation :
     - Online (vidéo)
     - Domicile
     - Cabinet
     - Video call
  5. Sélectionne date et heure disponibles
  6. Confirme le rendez-vous
  7. Système débit le montant du portefeuille
  8. Crée une notification pour le professionnel
- **Post-conditions :** Rendez-vous créé, paiement effectué, notification envoyée
- **Endpoint API :** `POST /api/appointments`
- **Modèle de données :** Appointment
- **Champs :**
  - user (ID patient)
  - professional (ID professionnel)
  - date
  - time
  - type (online, domicile, cabinet, video)
  - consultationFee
  - isPaid (true après paiement)
  - notes
- **Erreurs possibles :**
  - Solde insuffisant
  - Créneau non disponible
  - Professionnel introuvable

#### **UC-12 : Effectuer une consultation vidéo**
- **Acteur Principal :** Patient/Professionnel
- **Description :** Consulter par vidéoconférence
- **Flux Principal :**
  1. À l'heure du rendez-vous, système ouvre la page de consultation
  2. Lien vidéo disponible
  3. Patient et professionnel se connectent
  4. Chat textuel disponible
  5. Possibilité de partager des documents/ordonnances
  6. À la fin, génération d'une ordonnance/facture
- **Post-conditions :** Consultation enregistrée, ordonnance générée

#### **UC-13 : Consulter l'historique des rendez-vous**
- **Acteur Principal :** Patient/Professionnel
- **Description :** Afficher tous les rendez-vous passés et futurs
- **Endpoint API :** `GET /api/appointments`
- **Filtres :**
  - Date
  - Statut (upcoming, completed, cancelled)
  - Professionnel
- **Affichage :**
  - Liste avec date, heure, professionnel
  - Détails complets au clic
  - Facture/Ordonnance téléchargeable

---

### 3.5 CAS D'UTILISATION : Commande de Médicaments

#### **UC-14 : Commander des médicaments**
- **Acteur Principal :** Patient
- **Description :** Créer une commande de médicaments
- **Pré-conditions :** Utilisateur authentifié
- **Flux Principal :**
  1. Utilisateur va à "Commander"
  2. Sélectionne les médicaments
  3. Ajoute les quantités
  4. Sélectionne la pharmacie de livraison/retrait
  5. Ajoute une ordonnance (optionnel, upload PDF)
  6. Vérifie le total
  7. Effectue le paiement
  8. Confirme la commande
- **Post-conditions :** Commande créée, paiement effectué
- **Endpoint API :** `POST /api/orders`
- **Modèle de données :** Order
- **Champs :**
  - user (ID patient)
  - medicines (liste)
  - pharmacy (ID pharmacie)
  - prescription (optionnel, URL du fichier uploadé)
  - totalPrice
  - status (pending, confirmed, ready, completed, cancelled)
  - deliveryType (retrait, livraison)
  - createdAt
- **Erreurs possibles :**
  - Médicaments indisponibles
  - Pharmacie fermée
  - Paiement échoué

#### **UC-15 : Suivre une commande**
- **Acteur Principal :** Patient
- **Description :** Suivi en temps réel de la commande
- **Flux Principal :**
  1. Utilisateur va à "Mes Commandes"
  2. Sélectionne une commande
  3. Voit l'état : pending → confirmed → ready → completed
  4. Peut voir la pharmacie et l'heure de retrait/livraison
- **Endpoint API :** `GET /api/orders/:id`

#### **UC-16 : Modifier une commande**
- **Acteur Principal :** Patient
- **Description :** Modifier une commande avant confirmation
- **Flux Principal :**
  1. Utilisateur sélectionne une commande (status: pending)
  2. Clique sur "Modifier"
  3. Change les médicaments ou la pharmacie
  4. Valide les changements
  5. Le total est recalculé
- **Endpoint API :** `PUT /api/orders/:id`
- **Restrictions :** Seulement si status = "pending"

---

### 3.6 CAS D'UTILISATION : Gestion du Portefeuille

#### **UC-17 : Consulter le solde du portefeuille**
- **Acteur Principal :** Patient
- **Description :** Afficher le solde disponible
- **Flux Principal :**
  1. Utilisateur va à "Portefeuille"
  2. Voit son solde en temps réel
  3. Historique des transactions
  4. Dépôts et retraits récents
- **Endpoint API :** `GET /api/payments/transactions`
- **Champs affichés :**
  - Solde actuel (walletBalance)
  - Historique complet
  - Détails par transaction

#### **UC-18 : Ajouter de l'argent au portefeuille**
- **Acteur Principal :** Patient
- **Description :** Recharger le portefeuille
- **Flux Principal :**
  1. Utilisateur clique sur "Ajouter de l'argent"
  2. Saisit le montant
  3. Choisit le moyen de paiement :
     - Carte bancaire (simulée)
     - Virement
     - Mobile money (avec webhook pour opérateurs)
  4. Effectue le paiement
  5. Montant ajouté au portefeuille
  6. Notification de confirmation
- **Endpoint API :** `POST /api/payments/deposit`
- **Intégration :** Support des webhooks pour opérateurs mobiles
- **Webhook endpoint :** `POST /api/payments/webhook/:operator`

#### **UC-19 : Retirer de l'argent du portefeuille (pour Professionnels)**
- **Acteur Principal :** Professionnel de Santé
- **Description :** Retirer les gains accumulés
- **Flux Principal :**
  1. Professionnel va à "Mon Portefeuille"
  2. Clique sur "Retirer"
  3. Saisit le montant
  4. Choisit le compte bancaire ou mobile
  5. Effectue la demande
  6. Montant débité après confirmation
  7. Notification de retrait
- **Endpoint API :** `POST /api/professionals/withdraw`
- **Restrictions :** Solde suffisant, montant minimum

#### **UC-20 : Voir les transactions**
- **Acteur Principal :** Patient/Professionnel
- **Description :** Afficher l'historique complet des paiements
- **Endpoint API :** `GET /api/payments/transactions` ou `GET /api/payments/transactions/:id`
- **Filtres :**
  - Date (de/à)
  - Type (dépôt, retrait, achat, consultation)
  - Montant
- **Affichage :**
  - Date/Heure
  - Type de transaction
  - Montant
  - Solde avant/après
  - Statut

---

### 3.7 CAS D'UTILISATION : Gestion du Profil

#### **UC-21 : Afficher le profil utilisateur**
- **Acteur Principal :** Patient
- **Description :** Consulter ses informations personnelles
- **Flux Principal :**
  1. Utilisateur clique sur "Profil"
  2. Voit ses informations :
     - Nom, prénom
     - Téléphone
     - Email
     - Profession
     - Photo de profil
     - Walletbalance
- **Endpoint API :** `GET /api/auth/me`

#### **UC-22 : Modifier le profil**
- **Acteur Principal :** Patient
- **Description :** Mettre à jour les informations personnelles
- **Flux Principal :**
  1. Utilisateur clique sur "Modifier le profil"
  2. Édite les champs modifiables
  3. Peut changer la photo de profil
  4. Clique sur "Enregistrer"
  5. Système valide et met à jour
  6. Notification de confirmation
- **Endpoint API :** `PUT /api/users/profile`
- **Modèle de données :** User
- **Champs modifiables :**
  - nom
  - prenom
  - email
  - profession
  - photo (upload fichier)

#### **UC-23 : Changer le mot de passe**
- **Acteur Principal :** Patient
- **Description :** Mettre à jour le mot de passe
- **Flux Principal :**
  1. Utilisateur va à "Paramètres"
  2. Clique sur "Changer le mot de passe"
  3. Saisit l'ancien mot de passe
  4. Saisit le nouveau mot de passe (2x)
  5. Valide
  6. Mot de passe hashé et enregistré
  7. Notification de confirmation
- **Endpoint API :** `PUT /api/users/password`
- **Validation :**
  - Ancien mot de passe correct
  - Nouveau mot de passe fort (min 8 caractères, majuscule, chiffre, spécial)

---

### 3.8 CAS D'UTILISATION : Gestion des Notifications

#### **UC-24 : Consulter les notifications**
- **Acteur Principal :** Patient/Professionnel
- **Description :** Voir toutes les notifications
- **Flux Principal :**
  1. Utilisateur clique sur l'icône "Notifications"
  2. Voit la liste complète des notifications :
     - Rendez-vous confirmés/reminders
     - Commandes mises à jour
     - Avis importants
     - Messages des professionnels
  3. Les non-lues sont en gras/surlignées
  4. Peut filtrer par type
- **Endpoint API :** `GET /api/notifications`
- **Modèle de données :** Notification

#### **UC-25 : Marquer les notifications comme lues**
- **Acteur Principal :** Patient/Professionnel
- **Description :** Marquer une ou plusieurs notifications comme consultées
- **Flux Principal :**
  1. Utilisateur clique sur une notification (la marque comme lue)
  2. Ou clique sur "Marquer tout comme lu"
  3. Les notification disparaissent du badge non-lus
- **Endpoint API :** 
  - `PUT /api/notifications/:id/read` (une seule)
  - `PUT /api/notifications/read-all` (toutes)

#### **UC-26 : Créer une notification (Backend)**
- **Acteur Principal :** Système
- **Description :** Envoyer des notifications aux utilisateurs
- **Triggers :**
  - Rendez-vous confirmé
  - Rappel rendez-vous (24h avant)
  - Commande mise à jour
  - Paiement reçu
  - Retrait effectué
  - Message du professionnel
- **Endpoint API :** `POST /api/notifications` (admin/système)
- **Champs :**
  - userId
  - title
  - message
  - type (reminder, order, payment, message, alert)
  - isRead (false par défaut)

#### **UC-27 : Supprimer une notification**
- **Acteur Principal :** Patient
- **Description :** Supprimer une notification
- **Endpoint API :** `DELETE /api/notifications/:id`

---

### 3.9 CAS D'UTILISATION : Gestion des Rendez-vous (Professionnel)

#### **UC-28 : Afficher les rendez-vous du professionnel**
- **Acteur Principal :** Professionnel de Santé
- **Description :** Voir tous ses rendez-vous à venir et passés
- **Flux Principal :**
  1. Professionnel va à "Mes Rendez-vous"
  2. Voit la liste de ses rendez-vous :
     - Filtré par date (à venir, passés, tous)
     - Avec infos du patient
     - Détails de la consultation
  3. Peut voir les notes/ordonnances
- **Endpoint API :** `GET /api/professionals/appointments`

#### **UC-29 : Confirmer/Annuler un rendez-vous**
- **Acteur Principal :** Professionnel
- **Description :** Gérer l'état des rendez-vous
- **Flux Principal :**
  1. Professionnel clique sur un rendez-vous
  2. Peut le marquer comme :
     - Upcoming (par défaut)
     - Completed (après la consultation)
     - Cancelled (si impossible)
  3. Ajoute des notes/ordonnances
  4. Valide
  5. Patient reçoit une notification
- **Endpoint API :** `PUT /api/appointments/:id`
- **Champs modifiables :**
  - status
  - notes

#### **UC-30 : Voir le portefeuille professionnel**
- **Acteur Principal :** Professionnel
- **Description :** Afficher les gains et transactions
- **Flux Principal :**
  1. Professionnel va à "Mon Portefeuille"
  2. Voit :
     - Solde total
     - Gains du mois/année
     - Historique des consultations payantes
     - Transactions de retrait
  3. Statistiques de consultations
- **Endpoint API :** 
  - `GET /api/professionals/profile` (infos générales)
  - `GET /api/professionals/transactions` (historique)

---

## 4. MODÈLES DE DONNÉES

### 4.1 User (Patient)
```json
{
  "_id": "ObjectId",
  "nom": "String (required)",
  "prenom": "String (required)",
  "telephone": "String (required, unique)",
  "profession": "String (required)",
  "email": "String (lowercase)",
  "photo": "String (URL or base64, default: '')",
  "walletBalance": "Number (default: 0)",
  "password": "String (bcrypt hashed, required)",
  "isActive": "Boolean (default: true)",
  "createdAt": "Date (default: now)",
  "updatedAt": "Date (default: now)"
}
```

### 4.2 Pharmacy
```json
{
  "_id": "ObjectId",
  "name": "String (required)",
  "address": "String (required)",
  "telephone": "String (required)",
  "isOnCall": "Boolean (default: false)",
  "lat": "Number (géolocalisation)",
  "lng": "Number (géolocalisation)",
  "availableMedicines": "Array of Strings",
  "isActive": "Boolean (default: true)",
  "createdAt": "Date (default: now)",
  "updatedAt": "Date (default: now)"
}
```

### 4.3 Professional
```json
{
  "_id": "ObjectId",
  "nom": "String (required)",
  "prenom": "String (required)",
  "specialite": "String",
  "telephone": "String (required, unique)",
  "email": "String",
  "photo": "String",
  "description": "String",
  "consultationFee": "Number (required)",
  "walletBalance": "Number (default: 0)",
  "password": "String (required)",
  "isPaid": "Boolean (default: false)",
  "isActive": "Boolean (default: true)",
  "createdAt": "Date (default: now)",
  "updatedAt": "Date (default: now)"
}
```

### 4.4 Appointment
```json
{
  "_id": "ObjectId",
  "user": "ObjectId (ref: User)",
  "professional": "ObjectId (ref: Professional)",
  "date": "String (YYYY-MM-DD)",
  "time": "String (HH:mm)",
  "type": "Enum: ['online', 'domicile', 'cabinet', 'video']",
  "status": "Enum: ['upcoming', 'completed', 'cancelled']",
  "consultationFee": "Number (required)",
  "isPaid": "Boolean (default: false)",
  "notes": "String",
  "createdAt": "Date (default: now)",
  "updatedAt": "Date (default: now)"
}
```

### 4.5 Order
```json
{
  "_id": "ObjectId",
  "user": "ObjectId (ref: User)",
  "medicines": "Array of Objects [{name, dosage, quantity}]",
  "pharmacy": "ObjectId (ref: Pharmacy)",
  "prescription": "String (URL fichier upload)",
  "totalPrice": "Number",
  "status": "Enum: ['pending', 'confirmed', 'ready', 'completed', 'cancelled']",
  "deliveryType": "Enum: ['retrait', 'livraison']",
  "createdAt": "Date (default: now)",
  "updatedAt": "Date (default: now)"
}
```

### 4.6 Payment/Transaction
```json
{
  "_id": "ObjectId",
  "user": "ObjectId (ref: User)",
  "type": "Enum: ['deposit', 'withdrawal', 'purchase', 'consultation']",
  "amount": "Number",
  "status": "Enum: ['pending', 'completed', 'failed']",
  "method": "String (card, bank, mobile_money)",
  "operator": "String (optionnel, pour mobile money)",
  "description": "String",
  "balanceBefore": "Number",
  "balanceAfter": "Number",
  "createdAt": "Date (default: now)"
}
```

### 4.7 Notification
```json
{
  "_id": "ObjectId",
  "user": "ObjectId (ref: User)",
  "title": "String",
  "message": "String",
  "type": "Enum: ['reminder', 'order', 'payment', 'message', 'alert']",
  "isRead": "Boolean (default: false)",
  "relatedTo": "ObjectId (optionnel, ref appointment/order)",
  "createdAt": "Date (default: now)"
}
```

### 4.8 Transaction (Professionnel)
```json
{
  "_id": "ObjectId",
  "professional": "ObjectId (ref: Professional)",
  "appointment": "ObjectId (ref: Appointment)",
  "amount": "Number",
  "type": "Enum: ['income', 'withdrawal']",
  "status": "Enum: ['completed', 'pending']",
  "description": "String",
  "createdAt": "Date (default: now)"
}
```

---

## 5. ARCHITECTURE TECHNIQUE

### 5.1 Stack Technologique

#### Frontend
- **Langage :** TypeScript
- **Framework :** React 18+
- **Build Tool :** Vite
- **Styling :** Tailwind CSS
- **UI Components :** Component library custom
- **State Management :** React Hooks + Context API
- **API Client :** Axios ou Fetch API
- **Authentification :** JWT (localStorage)

#### Backend
- **Runtime :** Node.js
- **Framework :** Express.js
- **Base de données :** MongoDB
- **ODM :** Mongoose
- **Authentification :** JWT + bcrypt
- **Upload fichiers :** Multer
- **Validation :** express-validator ou Joi
- **CORS :** CORS middleware

#### APIs Externes
- **RxNorm API :** Pour données médicaments
- **Opérateurs Mobiles :** Webhooks pour paiements
- **Cartes Bancaires :** Simulation locale (non intégrée)

### 5.2 Architecture des Fichiers

```
Application Santé Pharmacie/
├── frontend/
│   ├── src/
│   │   ├── components/
│   │   │   ├── HomePage.tsx
│   │   │   ├── LoginPage.tsx
│   │   │   ├── SignupPage.tsx
│   │   │   ├── PharmacyPage.tsx
│   │   │   ├── ConsultationPage.tsx
│   │   │   ├── ProfilePage.tsx
│   │   │   ├── HistoryPage.tsx
│   │   │   ├── NotificationsPage.tsx
│   │   │   ├── WalletPage.tsx
│   │   │   ├── OnDutyPharmaciesPage.tsx
│   │   │   ├── ProfessionalWalletPage.tsx
│   │   │   ├── BookingModal.tsx
│   │   │   ├── CallModal.tsx
│   │   │   └── ui/ (Shadcn/ui components)
│   │   ├── types/
│   │   │   └── index.ts
│   │   ├── utils/
│   │   │   ├── api.ts (API calls)
│   │   │   └── baseComponents.tsx
│   │   ├── styles/
│   │   └── App.tsx
│   ├── vite.config.ts
│   └── package.json
│
└── backend/
    ├── models/
    │   ├── User.js
    │   ├── Pharmacy.js
    │   ├── Professional.js
    │   ├── Appointment.js
    │   ├── Order.js
    │   ├── Payment.js
    │   ├── Notification.js
    │   └── Transaction.js
    ├── routes/
    │   ├── auth.js
    │   ├── users.js
    │   ├── pharmacies.js
    │   ├── medicines.js
    │   ├── appointments.js
    │   ├── orders.js
    │   ├── payments.js
    │   ├── notifications.js
    │   ├── professionals.js
    │   └── (middleware/)
    ├── middleware/
    │   └── auth.js (JWT verification)
    ├── uploads/
    │   └── prescriptions/
    ├── server.js
    └── package.json
```

---

## 6. FLUX DE PAIEMENT ET SÉCURITÉ

### 6.1 Flux de Paiement

```
┌─────────────────────────────────────────────────────────────────┐
│                    FLUX DE PAIEMENT                              │
└─────────────────────────────────────────────────────────────────┘

1. DÉPÔT ARGENT (Deposit)
   User → POST /api/payments/deposit → Système
   ↓ (vérifie montant)
   ↓
   Crée Transaction (pending)
   ↓
   Simule paiement (webhook ou direct)
   ↓
   Transaction (completed)
   ↓
   User.walletBalance += montant
   ↓
   Notification utilisateur

2. ACHAT CONSULTATION
   User → POST /api/appointments → Système
   ↓ (vérifie solde)
   ↓
   Crée Appointment (isPaid: false)
   ↓
   Débite User.walletBalance
   ↓
   Appointment (isPaid: true)
   ↓
   Crée Transaction (type: consultation)
   ↓
   Crée Notification (Patient + Professional)

3. COMMANDE MÉDICAMENTS
   User → POST /api/orders → Système
   ↓ (calcule total)
   ↓
   POST /api/payments/pay → Paiement
   ↓ (débite portefeuille)
   ↓
   Order (status: confirmed)
   ↓
   Crée Transaction (type: purchase)
   ↓
   Notifications (Patient + Pharmacy)

4. RETRAIT PROFESSIONNEL (Withdrawal)
   Professional → POST /api/professionals/withdraw → Système
   ↓ (vérifie solde)
   ↓
   Débite Professional.walletBalance
   ↓
   Crée Transaction (type: withdrawal, pending)
   ↓
   (Après confirmation) Transaction (completed)
   ↓
   Notification
```

### 6.2 Sécurité

- **Authentification :** JWT avec expiration
- **Autorisation :** Middleware `auth` vérifie token
- **Hashage Mots de Passe :** bcrypt avec salt
- **Uploads Fichiers :** Multer avec validation (type, taille)
- **Validation Entrées :** express-validator sur toutes les routes
- **CORS :** Activé pour frontend URL
- **Rate Limiting :** Recommandé sur routes sensibles (login, payments)
- **Variables d'Environnement :** .env pour secrets (JWT_SECRET, MONGO_URI)

---

## 7. ENDPOINTS API COMPLET

### 7.1 Authentification (`/api/auth`)
| Méthode | Endpoint | Description | Auth |
|---------|----------|-------------|------|
| POST | `/register` | Inscription utilisateur | ❌ |
| POST | `/login` | Connexion utilisateur | ❌ |
| GET | `/me` | Profil actuel | ✅ |
| POST | `/refresh` | Rafraîchir token | ✅ |

### 7.2 Utilisateurs (`/api/users`)
| Méthode | Endpoint | Description | Auth |
|---------|----------|-------------|------|
| PUT | `/profile` | Mettre à jour profil | ✅ |
| PUT | `/wallet` | Mettre à jour portefeuille | ✅ |
| PUT | `/password` | Changer mot de passe | ✅ |
| GET | `/:id` | Afficher profil utilisateur | ✅ |

### 7.3 Pharmacies (`/api/pharmacies`)
| Méthode | Endpoint | Description | Auth |
|---------|----------|-------------|------|
| GET | `/` | Liste des pharmacies | ✅ |
| GET | `/:id` | Détails pharmacie | ✅ |
| GET | `/search/:medicine` | Pharmacies par médicament | ✅ |

### 7.4 Médicaments (`/api/medicines`)
| Méthode | Endpoint | Description | Auth |
|---------|----------|-------------|------|
| GET | `/search?name=...` | Recherche médicament | ✅ |
| GET | `/:name` | Détails médicament | ✅ |

### 7.5 Rendez-vous (`/api/appointments`)
| Méthode | Endpoint | Description | Auth |
|---------|----------|-------------|------|
| GET | `/` | Rendez-vous utilisateur | ✅ |
| POST | `/` | Créer rendez-vous | ✅ |
| PUT | `/:id` | Modifier rendez-vous | ✅ |
| GET | `/:id` | Détails rendez-vous | ✅ |

### 7.6 Commandes (`/api/orders`)
| Méthode | Endpoint | Description | Auth |
|---------|----------|-------------|------|
| GET | `/` | Commandes utilisateur | ✅ |
| POST | `/` | Créer commande (upload prescription) | ✅ |
| PUT | `/:id` | Modifier commande | ✅ |
| GET | `/:id` | Détails commande | ✅ |

### 7.7 Notifications (`/api/notifications`)
| Méthode | Endpoint | Description | Auth |
|---------|----------|-------------|------|
| GET | `/` | Notifications utilisateur | ✅ |
| PUT | `/:id/read` | Marquer comme lu | ✅ |
| PUT | `/read-all` | Tous marquer comme lu | ✅ |
| POST | `/` | Créer notification | ⚠️ Admin |
| DELETE | `/:id` | Supprimer notification | ✅ |

### 7.8 Paiements (`/api/payments`)
| Méthode | Endpoint | Description | Auth |
|---------|----------|-------------|------|
| POST | `/methods` | Ajouter méthode paiement | ✅ |
| GET | `/methods` | Lister méthodes | ✅ |
| DELETE | `/methods/:id` | Supprimer méthode | ✅ |
| POST | `/deposit` | Ajouter argent portefeuille | ✅ |
| POST | `/pay` | Payer une commande/consultation | ✅ |
| GET | `/transactions` | Historique transactions | ✅ |
| GET | `/transactions/:id` | Détails transaction | ✅ |
| POST | `/webhook/:operator` | Webhook opérateur mobile | ⚠️ Système |

### 7.9 Professionnels (`/api/professionals`)
| Méthode | Endpoint | Description | Auth |
|---------|----------|-------------|------|
| GET | `/profile` | Profil professionnel | ✅ Pro |
| GET | `/transactions` | Historique transactions | ✅ Pro |
| POST | `/withdraw` | Demander retrait | ✅ Pro |
| GET | `/appointments` | Rendez-vous du professionnel | ✅ Pro |

---

## 8. FONCTIONNALITÉS PRINCIPALES

### 8.1 Fonctionnalités Patients

✅ **Authentification & Profil**
- Inscription/Connexion
- Profil personnel
- Gestion mot de passe
- Photo de profil

✅ **Pharmacies**
- Afficher liste des pharmacies
- Recherche par médicament
- Filtrer par localisation
- Pharmacies de nuit 24h

✅ **Médicaments**
- Recherche médicaments (RxNorm)
- Voir détails, dosages, fabricants

✅ **Consultations**
- Prendre rendez-vous avec professionnels
- Types : online, vidéo, domicile, cabinet
- Consulter par vidéoconférence
- Historique rendez-vous

✅ **Commandes**
- Commander médicaments
- Upload ordonnance (PDF)
- Suivre commande en temps réel
- Modifier avant confirmation

✅ **Portefeuille Électronique**
- Afficher solde
- Ajouter argent (dépôt)
- Historique transactions
- Paiements sécurisés

✅ **Notifications**
- Recevoir alertes rendez-vous
- Suivi commandes
- Confirmations paiements
- Messages professionnels

---

### 8.2 Fonctionnalités Professionnels de Santé

✅ **Gestion Rendez-vous**
- Voir ses rendez-vous
- Confirmer/Annuler
- Ajouter notes/ordonnances
- Avis de disponibilité

✅ **Consultations**
- Effectuer consultations vidéo
- Chat avec patients
- Partager documents
- Générer ordonnances

✅ **Portefeuille Professionnel**
- Voir gains des consultations
- Historique transactions
- Statistiques mensuelles
- Demander retrait d'argent

✅ **Profil**
- Gérer informations
- Ajouter spécialité
- Définir tarifs consultation
- Photo de profil

---

## 9. INTÉGRATIONS EXTERNES

### 9.1 RxNorm API
- **Source :** Base de données médicaments USA
- **Utilisation :** Recherche et détails médicaments
- **Endpoint :** `GET /api/medicines/search`
- **Données :** Nom, dosage, forme, fabricant

### 9.2 Opérateurs Mobile Money
- **Intégration :** Webhooks pour paiements mobile
- **Endpoint :** `POST /api/payments/webhook/:operator`
- **Supporte :** Orange Money, Moov, Airtel, etc.
- **Flux :** Paiement → Notification → Mise à jour portefeuille

### 9.3 Vidéoconférence (Future)
- **Intégration :** Jitsi, Twilio, ou Agora
- **Utilisation :** Consultations en direct
- **Page :** CallModal.tsx

---

## 10. DONNÉES & CONFIDENTIALITÉ

### 10.1 Conservation des Données
- Utilisateurs actifs : Indéfini
- Historique transactions : 5 ans recommandé
- Ordonnances : Conformité légale (3+ ans)
- Logs système : 90 jours

### 10.2 Conformité
- RGPD (si UE) / Législations locales
- Cryptage données sensibles
- Droit à l'oubli
- Consentement utilisateur

### 10.3 Permissions
- Localisation (avec consentement)
- Appareil photo/microphone (vidéo)
- Notification (opt-in)

---

## 11. FLUX UTILISATEUR PRINCIPAUX

### 11.1 Flux Patient - Consultation Médicale

```
1. Accueil
   ↓
2. Consultation
   ↓ (Choisir médecin/spécialité)
   ↓
3. Choisir type & horaire
   ↓ (Vérifier solde portefeuille)
   ↓
4. Confirmer rendez-vous
   ↓ (Paiement débité)
   ↓
5. Notification reçue
   ↓
6. Jour du RDV → Vidéoappel
   ↓ (Chat disponible)
   ↓
7. Fin consultation
   ↓ (Ordonnance générée)
   ↓
8. Accès ordonnance/facture dans Historique
```

### 11.2 Flux Patient - Commander Médicaments

```
1. Accueil
   ↓
2. Pharmacies
   ↓ (Rechercher pharmacie/médicament)
   ↓
3. Commander
   ↓ (Ajouter médicaments au panier)
   ↓
4. Uploader ordonnance (optionnel)
   ↓
5. Sélectionner pharmacy & type livraison
   ↓
6. Valider panier
   ↓ (Débiter portefeuille)
   ↓
7. Commande confirmée
   ↓ (Notification envoyée à pharmacie)
   ↓
8. Suivre commande (pending → confirmed → ready → completed)
```

### 11.3 Flux Patient - Recharger Portefeuille

```
1. Portefeuille
   ↓
2. Ajouter de l'argent
   ↓ (Saisir montant)
   ↓
3. Choisir méthode paiement
   ↓ (Carte/Mobile Money)
   ↓
4. Effectuer paiement
   ↓ (Vérification)
   ↓
5. Montant ajouté au portefeuille
   ↓ (Notification confirmation)
   ↓
6. Transaction visible dans historique
```

---

## 12. POINTS CLÉS DE FONCTIONNEMENT

| Fonction | Technologie | État |
|----------|-------------|------|
| **Auth JWT** | bcrypt + JWT | ✅ Implémenté |
| **Upload fichiers** | Multer | ✅ Implémenté |
| **Base données** | MongoDB + Mongoose | ✅ Implémenté |
| **API RxNorm** | Appel API externe | ✅ Intégré |
| **Paiements** | Simulation locale + Webhooks | ✅ Fonctionnel |
| **Vidéoconférence** | Cadre (CallModal) | ⏳ À intégrer |
| **Notifications real-time** | HTTP polling ou WebSocket | ⏳ À optimiser |
| **Localisation** | Geolocalisation browser | ✅ Disponible |
| **Upload photo profil** | Base64/Fichier | ✅ Implémenté |

---

## 13. LIMITATIONS CONNUES & AMÉLIORATIONS FUTURES

### Limitations
1. ⚠️ Vidéoconférence : Cadre uniquement (à intégrer avec Jitsi/Twilio)
2. ⚠️ Notifications : Polling HTTP (à remplacer par WebSocket)
3. ⚠️ Paiements : Simulation locale (intégrer vrais paiements)
4. ⚠️ Base de données : MongoDB locale (utiliser cloud Atlas)
5. ⚠️ Authentification : Pas de 2FA

### Améliorations Recommandées
1. **WebSocket** pour notifications temps réel
2. **Intégration Twilio/Jitsi** pour vidéoconférence
3. **Stripe/PayPal** pour paiements réels
4. **Cache Redis** pour performances
5. **Tests automatisés** (Jest, Cypress)
6. **Documentation Swagger** pour API
7. **Monitoring & Logging** (Winston, LogRocket)
8. **2FA** pour sécurité renforcée
9. **Rate Limiting** pour protection DDoS
10. **Métriques analytiques** (Google Analytics)

---

## 14. CONFIGURATION & DÉPLOIEMENT

### 14.1 Variables d'Environnement (.env)

**Backend :**
```env
# MongoDB
MONGO_URI=mongodb+srv://user:password@cluster.mongodb.net/santé-pharmacie

# JWT
JWT_SECRET=your-super-secret-key-change-in-production

# Server
PORT=5000
NODE_ENV=development

# Upload
UPLOAD_FOLDER=./uploads

# RxNorm API (optionnel)
RXNORM_API_BASE=https://rxnav.nlm.nih.gov/REST
```

**Frontend :**
```env
VITE_API_URL=http://localhost:5000/api
VITE_APP_NAME=Santé Pharmacie
```

### 14.2 Installation & Démarrage

**Backend :**
```bash
cd backend
npm install
# Créer .env avec variables
npm start       # Production
npm run dev     # Développement
```

**Frontend :**
```bash
npm install
npm run dev     # Développement (Vite)
npm run build   # Build production
```

---

## 15. RÉSUMÉ EXÉCUTIF

L'**Application Santé Pharmacie** est une plateforme mobile/web complète de télémédecine et pharmacie digitale permettant :

✅ Aux **patients** de :
- Consulter des médecins en ligne
- Commander des médicaments
- Gérer un portefeuille électronique
- Recevoir des notifications

✅ Aux **professionnels** de santé de :
- Gérer leurs consultations
- Recevoir des paiements
- Retirer leurs gains
- Gérer leur disponibilité

✅ Aux **pharmacies** de :
- Recevoir les commandes
- Gérer l'inventaire
- Livrer les médicaments

**Architecture :**
- Frontend : React + TypeScript + Vite
- Backend : Node.js + Express + MongoDB
- Authentification : JWT
- Paiements : Simulation locale + Mobile Money
- API externe : RxNorm pour médicaments

**État :** Application fonctionnelle avec fonctionnalités core implémentées. Améliorations recommandées sur vidéoconférence temps réel et paiements productifs.

---

## 4. NOUVELLES FONCTIONNALITÉS (VERSION 2.0)

### 4.1 INTERFACE PROFESSIONNEL DE SANTÉ

#### **UC-PRO-1 : Accès Tableau de Bord Professionnel**
- **Acteur Principal :** Professionnel de Santé
- **Description :** Accès au dashboard personnalisé avec statistiques
- **Pré-conditions :** Utilisateur authentifié avec rôle `professional`
- **Flux Principal :**
  1. Connexion automatique vers le tableau de bord professionnel
  2. Affichage des statistiques : RDV du jour, revenus mensuels, patients totaux
  3. Actions rapides : Gestion RDV, Portefeuille, Vue Patient
- **Post-conditions :** Vue d'ensemble de l'activité professionnelle
- **Endpoint API :** `GET /api/professionals/dashboard`

#### **UC-PRO-2 : Gestion des Rendez-vous Professionnels**
- **Acteur Principal :** Professionnel de Santé
- **Description :** Gestion complète des rendez-vous reçus
- **Pré-conditions :** Professionnel connecté
- **Flux Principal :**
  1. Consultation de la liste des rendez-vous
  2. Filtrage par statut (à venir, confirmé, terminé, annulé)
  3. Actions disponibles :
     - **Confirmer** un rendez-vous
     - **Terminer** avec notes et ordonnance
     - **Annuler** avec motif
     - **Consulter** les informations patient
  4. Ajout de notes de consultation
  5. Prescription d'ordonnances numériques
- **Post-conditions :** Rendez-vous mis à jour, patient notifié
- **Endpoint API :** `GET /api/professionals/appointments`, `PUT /api/professionals/appointments/:id`

#### **UC-PRO-3 : Gestion Portefeuille Professionnel**
- **Acteur Principal :** Professionnel de Santé
- **Description :** Gestion des gains et retraits
- **Pré-conditions :** Professionnel connecté
- **Flux Principal :**
  1. Vue du solde disponible et des gains totaux
  2. Historique des transactions détaillé
  3. Demande de retrait avec coordonnées bancaires
  4. Validation et traitement des retraits
- **Post-conditions :** Gains gérés, retraits traités
- **Endpoint API :** `GET /api/professionals/transactions`, `POST /api/professionals/withdraw`

#### **UC-PRO-4 : Inscription Professionnelle**
- **Acteur Principal :** Visiteur (professionnel de santé)
- **Description :** Création de compte professionnel en 3 étapes
- **Pré-conditions :** Visiteur non inscrit
- **Flux Principal :**
  1. **Étape 1** : Informations personnelles (nom, prénom, téléphone, email)
  2. **Étape 2** : Informations professionnelles (spécialité, cabinet, honoraires, licence)
  3. **Étape 3** : Sécurité (mot de passe, confirmation)
  4. Soumission et validation des informations
  5. Création automatique du profil professionnel
  6. Redirection vers le tableau de bord
- **Post-conditions :** Compte professionnel créé, en attente de validation admin
- **Endpoint API :** `POST /api/auth/professional-register`

### 4.2 INTERFACE ADMINISTRATEUR

#### **UC-ADMIN-1 : Accès Sécurisé Admin**
- **Acteur Principal :** Administrateur
- **Description :** Connexion sécurisée au panneau d'administration
- **Pré-conditions :** Posséder le code d'accès admin
- **Flux Principal :**
  1. Accès à la page d'administration dédiée
  2. Saisie du code d'accès sécurisé
  3. Validation et authentification
  4. Redirection vers le dashboard admin
- **Post-conditions :** Administrateur authentifié
- **Endpoint API :** `POST /api/auth/admin-login`

#### **UC-ADMIN-2 : Tableau de Bord Administratif**
- **Acteur Principal :** Administrateur
- **Description :** Vue d'ensemble de l'application
- **Pré-conditions :** Administrateur authentifié
- **Flux Principal :**
  1. Affichage des statistiques globales :
     - Total utilisateurs, professionnels, rendez-vous, commandes
     - Revenus totaux et croissance mensuelle
  2. Vue des activités récentes :
     - Nouveaux utilisateurs
     - Derniers rendez-vous
  3. Actions rapides vers les modules de gestion
- **Post-conditions :** Vue complète de l'état de la plateforme
- **Endpoint API :** `GET /api/admin/stats`, `GET /api/admin/recent-activities`

#### **UC-ADMIN-3 : Gestion des Utilisateurs**
- **Acteur Principal :** Administrateur
- **Description :** Administration complète des comptes utilisateurs
- **Pré-conditions :** Administrateur authentifié
- **Flux Principal :**
  1. Liste de tous les utilisateurs avec filtres
  2. Actions par utilisateur :
     - **Voir détails** (profil, informations, rôle)
     - **Activer/Désactiver** le compte
     - **Supprimer** le compte (avec confirmation)
     - **Modifier** les informations
  3. Gestion spécifique des professionnels :
     - Validation des certifications
     - Vérification des licences
     - Activation des comptes professionnels
- **Post-conditions :** Utilisateurs gérés, plateforme sécurisée
- **Endpoint API :** `GET /api/admin/users`, `PUT /api/admin/users/:id`, `DELETE /api/admin/users/:id`

---

## 5. ARCHITECTURE TECHNIQUE MISE À JOUR

### 5.1 STACK TECHNOLOGIQUE

**Frontend :**
- React 18.3.1 avec TypeScript
- Vite 6.3.5 (build tool)
- TailwindCSS pour le styling
- Radix UI pour les composants
- Capacitor pour le déploiement mobile

**Backend :**
- Node.js avec Express
- MongoDB avec Mongoose
- JWT pour l'authentification
- Architecture RESTful API

**Nouvelles Interfaces :**
- `ProfessionalDashboard.tsx` : Tableau de bord professionnel
- `ProfessionalAppointmentsPage.tsx` : Gestion RDV professionnelle
- `ProfessionalWalletPage.tsx` : Portefeuille professionnel (existant)
- `AdminDashboard.tsx` : Tableau de bord administratif
- `AdminUsersPage.tsx` : Gestion des utilisateurs
- `ProfessionalSignupPage.tsx` : Inscription professionnelle 3 étapes
- `AdminAccessPage.tsx` : Accès sécurisé administrateur

### 5.2 MODÈLES DE DONNÉS

**Types étendus :**
- `User` : Ajout du champ `role` et `professionalProfile`
- `Professional` : Enrichissement avec `verified`, `licenseNumber`, `experience`
- `AdminStats`, `AdminUser`, `ProfessionalAppointment` : Nouveaux types

**API Routes :**
- `/api/auth/*` : Authentification (login, register, admin-access)
- `/api/professionals/*` : Fonctionnalités professionnelles
- `/api/admin/*` : Fonctionnalités administratives

### 5.3 NAVIGATION INTELLIGENTE

**Redirection automatique selon le rôle :**
- `patient` → Page d'accueil utilisateur
- `professional` → Tableau de bord professionnel
- `admin` → Tableau de bord administratif

**Accès hybride pour professionnels :**
- Un professionnel peut utiliser toutes les fonctionnalités patient
- Basculement entre vue patient et vue professionnelle

---

**Architecture :**
- Frontend : React + TypeScript + Vite
- Backend : Node.js + Express + MongoDB
- Authentification : JWT avec rôles
- Paiements : Simulation locale + Mobile Money
- API externe : RxNorm pour médicaments
- **Nouveau :** Gestion multi-rôles avec interfaces spécialisées

**État :** Application fonctionnelle avec interfaces Patient, Professionnel et Admin complètes. Prête pour déploiement en production.

---

**Document généré le 6 février 2026 (Version 2.0)**  
**Pour questions ou modifications, veuillez consulter l'équipe de développement**
