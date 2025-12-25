# Guide de Configuration BioMedak avec XAMPP

Ce guide vous explique comment configurer et exécuter BioMedak sur votre PC avec XAMPP.

## Prérequis

1. **XAMPP** installé (télécharger depuis https://www.apachefriends.org/)
2. **Node.js** version 16 ou supérieure (télécharger depuis https://nodejs.org/)
3. Un éditeur de code (VS Code recommandé)

## Étape 1: Installation de XAMPP

1. Téléchargez et installez XAMPP
2. Lancez le "XAMPP Control Panel"
3. Démarrez les modules **Apache** et **MySQL**
4. Vérifiez que Apache tourne sur le port 80 et MySQL sur le port 3306

## Étape 2: Configuration de la Base de Données

### 2.1 Accéder à phpMyAdmin

1. Ouvrez votre navigateur
2. Allez sur: `http://localhost/phpmyadmin`
3. Si cela ne fonctionne pas, vérifiez qu'Apache et MySQL sont démarrés

### 2.2 Créer la Base de Données

1. Dans phpMyAdmin, cliquez sur "Nouvelle base de données" dans le menu de gauche
2. Nommez-la: `biomedak_gmao`
3. Choississez l'interclassement: `utf8mb4_unicode_ci`
4. Cliquez sur "Créer"

### 2.3 Importer le Schéma

1. Sélectionnez la base `biomedak_gmao` dans la liste de gauche
2. Cliquez sur l'onglet **"Importer"** en haut
3. Cliquez sur **"Choisir un fichier"**
4. Sélectionnez le fichier `database_schema.sql` du projet
5. Cliquez sur **"Exécuter"** en bas de page
6. Vous devriez voir un message de succès

### 2.4 Vérifier les Tables

Dans l'onglet "Structure", vous devriez voir 3 tables:
- `users` (contient les utilisateurs)
- `equipements` (contient les équipements médicaux)
- `interventions` (contient les ordres de travail)

## Étape 3: Installation du Backend PHP

### 3.1 Copier les Fichiers PHP

1. Localisez votre dossier XAMPP (généralement `C:\xampp\` sur Windows)
2. Naviguez vers `C:\xampp\htdocs\`
3. Créez un nouveau dossier nommé `biomedak`
4. Copiez le dossier `server` de votre projet dans `C:\xampp\htdocs\biomedak\`

Résultat final:
```
C:\xampp\htdocs\biomedak\server\
├── config.php
├── .htaccess
└── api\
    ├── auth.php
    ├── equipements.php
    ├── interventions.php
    └── stats.php
```

### 3.2 Vérifier la Configuration

1. Ouvrez `C:\xampp\htdocs\biomedak\server\config.php`
2. Vérifiez les paramètres de connexion:
   ```php
   define('DB_HOST', 'localhost');
   define('DB_USER', 'root');
   define('DB_PASS', '');  // Vide par défaut sur XAMPP
   define('DB_NAME', 'biomedak_gmao');
   ```
3. Si vous avez modifié ces paramètres dans MySQL, ajustez-les ici

### 3.3 Tester l'API

1. Ouvrez votre navigateur
2. Allez sur: `http://localhost/biomedak/server/api/auth.php`
3. Vous devriez voir: `{"user":null}`
4. Si vous voyez une erreur, vérifiez:
   - Qu'Apache est démarré
   - Que le chemin est correct
   - Que MySQL est démarré et la base existe

## Étape 4: Installation du Frontend React

### 4.1 Installer les Dépendances Node

1. Ouvrez un terminal (CMD ou PowerShell)
2. Naviguez vers le dossier de votre projet:
   ```bash
   cd chemin\vers\votre\projet
   ```
3. Installez les dépendances:
   ```bash
   npm install
   ```
4. Attendez que l'installation se termine (peut prendre quelques minutes)

### 4.2 Vérifier la Configuration de l'API

1. Ouvrez le fichier `src\lib\api.ts`
2. Vérifiez que l'URL est correcte:
   ```typescript
   const API_BASE = 'http://localhost/biomedak/server/api';
   ```
3. Si votre dossier XAMPP est ailleurs, ajustez l'URL

### 4.3 Démarrer le Serveur de Développement

1. Dans le terminal, exécutez:
   ```bash
   npm run dev
   ```
2. Vous devriez voir un message indiquant que le serveur tourne sur `http://localhost:5173`
3. Ouvrez cette adresse dans votre navigateur

## Étape 5: Première Connexion

### Compte par Défaut

L'application crée automatiquement un compte administrateur:

- **Email**: `admin@biomedak.com`
- **Mot de passe**: `admin123`

### Test de Connexion

1. Sur la page de connexion, entrez ces identifiants
2. Cliquez sur "Se connecter"
3. Vous devriez accéder au tableau de bord

## Résolution des Problèmes

### Problème: "Cannot connect to database"

**Solutions**:
- Vérifiez que MySQL est démarré dans XAMPP
- Vérifiez que la base `biomedak_gmao` existe
- Vérifiez les paramètres dans `server/config.php`
- Redémarrez MySQL dans XAMPP

### Problème: "CORS Error" dans le navigateur

**Solutions**:
- Vérifiez que Apache est démarré
- Vérifiez l'URL dans `src/lib/api.ts`
- Assurez-vous que le fichier `.htaccess` est présent dans `server/`
- Redémarrez Apache dans XAMPP

### Problème: "404 Not Found" pour l'API

**Solutions**:
- Vérifiez que les fichiers PHP sont dans `C:\xampp\htdocs\biomedak\server\`
- Testez l'URL directement: `http://localhost/biomedak/server/api/auth.php`
- Vérifiez qu'Apache tourne sur le port 80
- Si Apache utilise un autre port, ajustez l'URL dans `src/lib/api.ts`

### Problème: Le frontend ne démarre pas

**Solutions**:
- Assurez-vous que Node.js est installé: `node --version`
- Supprimez le dossier `node_modules` et réinstallez: `npm install`
- Vérifiez qu'aucun autre processus n'utilise le port 5173
- Essayez de changer de port en modifiant `vite.config.ts`

### Problème: Les sessions ne fonctionnent pas

**Solutions**:
- Assurez-vous que PHP peut écrire dans son dossier temp
- Vérifiez que les cookies sont activés dans votre navigateur
- Essayez de vous déconnecter et reconnecter
- Videz le cache du navigateur

## Structure des Fichiers Important

```
projet/
├── server/                      # Backend PHP (à copier dans XAMPP)
│   ├── config.php              # Configuration DB
│   ├── .htaccess               # Configuration Apache
│   └── api/                    # Points d'accès API
│       ├── auth.php            # Authentification
│       ├── equipements.php     # Gestion équipements
│       ├── interventions.php   # Gestion interventions
│       └── stats.php           # Statistiques
│
├── src/                        # Frontend React
│   ├── lib/
│   │   ├── api.ts             # Client API (IMPORTANT: URL à vérifier)
│   │   └── auth-context.tsx   # Gestion authentification
│   └── components/            # Composants React
│
├── database_schema.sql        # Schéma à importer dans phpMyAdmin
└── README.md                  # Documentation principale
```

## Commandes Utiles

```bash
npm run dev          # Démarre le serveur de développement
npm run build        # Compile l'application pour production
npm install          # Installe les dépendances
```

## Ports Utilisés

- **Frontend React**: `http://localhost:5173`
- **Backend PHP (Apache)**: `http://localhost` (port 80)
- **MySQL**: port 3306
- **phpMyAdmin**: `http://localhost/phpmyadmin`

## Sécurité

Pour une utilisation en production:
1. Changez le mot de passe de l'admin
2. Configurez un mot de passe MySQL
3. Activez HTTPS
4. Modifiez les clés de session dans `config.php`
5. Désactivez les messages d'erreur détaillés

## Support

Si vous rencontrez des problèmes non couverts ici:
1. Vérifiez les logs d'erreur Apache: `C:\xampp\apache\logs\error.log`
2. Vérifiez les logs MySQL: `C:\xampp\mysql\data\mysql_error.log`
3. Ouvrez la console développeur de votre navigateur (F12)
4. Consultez le fichier README.md pour plus d'informations
