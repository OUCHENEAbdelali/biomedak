# BioMedak - Système de Gestion de Maintenance Hospitalière

Application de gestion de maintenance pour équipements hospitaliers avec XAMPP et React.

## Configuration Requise

- XAMPP (Apache + MySQL + PHP 7.4+)
- Node.js 16+ et npm
- Navigateur web moderne

## Installation

### 1. Configuration de la Base de Données

1. Démarrez XAMPP et lancez Apache et MySQL
2. Ouvrez phpMyAdmin dans votre navigateur: `http://localhost/phpmyadmin`
3. Créez une nouvelle base de données nommée `biomedak_gmao`
4. Importez le fichier `database_schema.sql` dans phpMyAdmin:
   - Cliquez sur la base `biomedak_gmao`
   - Allez dans l'onglet "Importer"
   - Sélectionnez le fichier `database_schema.sql`
   - Cliquez sur "Exécuter"

### 2. Configuration du Backend PHP

1. Copiez le dossier `server` dans votre répertoire XAMPP:
   ```
   Copiez le dossier: project/server
   Vers: C:\xampp\htdocs\biomedak\server
   ```

2. Vérifiez la configuration de la base de données dans `server/config.php`:
   ```php
   define('DB_HOST', 'localhost');
   define('DB_USER', 'root');
   define('DB_PASS', '');  // Changez si vous avez un mot de passe
   define('DB_NAME', 'biomedak_gmao');
   ```

3. Testez l'API en visitant: `http://localhost/biomedak/server/api/auth.php`
   Vous devriez voir: `{"user":null}`

### 3. Configuration du Frontend React

1. Ouvrez un terminal dans le dossier du projet

2. Installez les dépendances:
   ```bash
   npm install
   ```

3. Vérifiez que l'URL de l'API dans `src/lib/api.ts` correspond à votre installation:
   ```typescript
   const API_BASE = 'http://localhost/biomedak/server/api';
   ```
   Si votre dossier XAMPP est différent, ajustez l'URL en conséquence.

4. Démarrez le serveur de développement:
   ```bash
   npm run dev
   ```

5. Ouvrez votre navigateur à l'adresse: `http://localhost:5173`

## Connexion par Défaut

- **Email**: admin@biomedak.com
- **Mot de passe**: admin123

## Structure du Projet

```
project/
├── server/                    # Backend PHP
│   ├── config.php            # Configuration DB et utilitaires
│   ├── api/                  # Points d'accès API
│   │   ├── auth.php         # Authentification
│   │   ├── equipements.php  # Gestion équipements
│   │   ├── interventions.php # Gestion interventions
│   │   └── stats.php        # Statistiques
├── src/                      # Frontend React
│   ├── components/          # Composants React
│   ├── lib/                 # Bibliothèques
│   │   ├── api.ts          # Client API
│   │   └── auth-context.tsx # Contexte d'authentification
│   └── types/              # Types TypeScript
├── database_schema.sql      # Schéma de base de données
└── README.md               # Ce fichier
```

## Fonctionnalités

- Gestion des équipements médicaux
- Suivi des interventions de maintenance
- Tableau de bord avec statistiques
- Scanner QR code pour les équipements
- Export CSV des données
- Gestion des utilisateurs
- Authentification sécurisée

## Dépannage

### Problème: CORS Error

Si vous rencontrez une erreur CORS, vérifiez que:
1. Apache est bien démarré dans XAMPP
2. L'URL de l'API dans `src/lib/api.ts` est correcte
3. Les headers CORS sont correctement configurés dans `server/config.php`

### Problème: Connexion à la base de données échoue

Vérifiez que:
1. MySQL est démarré dans XAMPP
2. La base de données `biomedak_gmao` existe
3. Les identifiants dans `server/config.php` sont corrects

### Problème: Sessions ne fonctionnent pas

Assurez-vous que:
1. PHP est configuré pour utiliser les sessions
2. Le dossier `temp` de XAMPP est accessible en écriture
3. Les cookies sont activés dans votre navigateur

## Build pour Production

Pour créer une version de production:

```bash
npm run build
```

Les fichiers seront générés dans le dossier `dist/`. Copiez ce dossier dans `C:\xampp\htdocs\biomedak\` et accédez à l'application via `http://localhost/biomedak/`.

## Support

Pour toute question ou problème, consultez la documentation ou contactez l'équipe de support.
