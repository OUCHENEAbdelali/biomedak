<?php
header('Content-Type: text/html; charset=utf-8');
?>
<!DOCTYPE html>
<html lang="fr">
<head>
    <meta charset="UTF-8">
    <title>Test de Configuration BioMedak</title>
    <style>
        body {
            font-family: Arial, sans-serif;
            max-width: 800px;
            margin: 50px auto;
            padding: 20px;
            background: #f5f5f5;
        }
        .test {
            background: white;
            padding: 20px;
            margin: 10px 0;
            border-radius: 8px;
            box-shadow: 0 2px 4px rgba(0,0,0,0.1);
        }
        .success {
            border-left: 4px solid #27ae60;
        }
        .error {
            border-left: 4px solid #e74c3c;
        }
        h1 {
            color: #2c3e50;
        }
        .status {
            font-weight: bold;
            font-size: 18px;
        }
        .success .status {
            color: #27ae60;
        }
        .error .status {
            color: #e74c3c;
        }
    </style>
</head>
<body>
    <h1>Test de Configuration BioMedak</h1>

    <?php
    $db_host = 'localhost';
    $db_user = 'root';
    $db_pass = '';
    $db_name = 'biomedak_gmao';

    $all_good = true;

    echo '<div class="test success">';
    echo '<div class="status">✓ PHP Fonctionne</div>';
    echo '<p>Version PHP: ' . phpversion() . '</p>';
    echo '</div>';

    try {
        $pdo = new PDO("mysql:host=$db_host;dbname=$db_name;charset=utf8mb4", $db_user, $db_pass);
        echo '<div class="test success">';
        echo '<div class="status">✓ Connexion MySQL Réussie</div>';
        echo '<p>Base de données: ' . $db_name . '</p>';
        echo '</div>';
    } catch(PDOException $e) {
        $all_good = false;
        echo '<div class="test error">';
        echo '<div class="status">✗ Erreur de Connexion MySQL</div>';
        echo '<p>Message: ' . $e->getMessage() . '</p>';
        echo '<p><strong>Solutions:</strong></p>';
        echo '<ul>';
        echo '<li>Vérifiez que MySQL est démarré dans XAMPP</li>';
        echo '<li>Vérifiez que la base "' . $db_name . '" existe dans phpMyAdmin</li>';
        echo '<li>Vérifiez les identifiants de connexion</li>';
        echo '</ul>';
        echo '</div>';
    }

    if (isset($pdo)) {
        $tables = ['users', 'equipements', 'interventions'];
        $missing_tables = [];

        foreach ($tables as $table) {
            try {
                $stmt = $pdo->query("SELECT 1 FROM $table LIMIT 1");
            } catch(PDOException $e) {
                $missing_tables[] = $table;
            }
        }

        if (empty($missing_tables)) {
            echo '<div class="test success">';
            echo '<div class="status">✓ Toutes les Tables Existent</div>';
            echo '<p>Tables trouvées: ' . implode(', ', $tables) . '</p>';
            echo '</div>';

            $count = $pdo->query("SELECT COUNT(*) FROM users")->fetchColumn();
            echo '<div class="test success">';
            echo '<div class="status">✓ Table Users</div>';
            echo '<p>Nombre d\'utilisateurs: ' . $count . '</p>';
            echo '</div>';

        } else {
            $all_good = false;
            echo '<div class="test error">';
            echo '<div class="status">✗ Tables Manquantes</div>';
            echo '<p>Tables non trouvées: ' . implode(', ', $missing_tables) . '</p>';
            echo '<p><strong>Solution:</strong> Importez le fichier database_schema.sql dans phpMyAdmin</p>';
            echo '</div>';
        }
    }

    if (session_start()) {
        echo '<div class="test success">';
        echo '<div class="status">✓ Sessions PHP Actives</div>';
        echo '</div>';
    } else {
        $all_good = false;
        echo '<div class="test error">';
        echo '<div class="status">✗ Erreur Sessions PHP</div>';
        echo '</div>';
    }

    if ($all_good) {
        echo '<div class="test success" style="border-left: 4px solid #27ae60; background: #d4edda;">';
        echo '<h2 style="color: #27ae60; margin-top: 0;">Configuration Réussie!</h2>';
        echo '<p>Votre serveur PHP est correctement configuré.</p>';
        echo '<p><strong>Prochaines étapes:</strong></p>';
        echo '<ol>';
        echo '<li>Démarrez le frontend React: <code>npm run dev</code></li>';
        echo '<li>Ouvrez http://localhost:5173 dans votre navigateur</li>';
        echo '<li>Connectez-vous avec: admin@biomedak.com / admin123</li>';
        echo '</ol>';
        echo '</div>';
    } else {
        echo '<div class="test error" style="border-left: 4px solid #e74c3c; background: #f8d7da;">';
        echo '<h2 style="color: #e74c3c; margin-top: 0;">Configuration Incomplète</h2>';
        echo '<p>Veuillez corriger les erreurs ci-dessus avant de continuer.</p>';
        echo '</div>';
    }
    ?>

</body>
</html>
