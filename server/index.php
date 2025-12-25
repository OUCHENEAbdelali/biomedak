<?php include 'db.php'; ?>
<!DOCTYPE html>
<html lang="fr">
<head>
    <meta charset="UTF-8">
    <title>GMAO - Tableau de Bord</title>
    <link rel="stylesheet" href="style.css">
</head>
<body>

    <!-- SIDEBAR -->
    <div class="sidebar">
        <h2>🏥 GMAO Hôpital</h2>
        <a href="index.php" class="active">📊 Tableau de Bord</a>
        <a href="equipements.php">📦 Équipements</a>
        <a href="interventions.php">🔧 Interventions</a>
    </div>

    <!-- CONTENU -->
    <div class="content">
        <h1>Tableau de Bord</h1>

        <?php
        // Récupération des statistiques
        $nb_total = $pdo->query("SELECT COUNT(*) FROM equipements")->fetchColumn();
        $nb_panne = $pdo->query("SELECT COUNT(*) FROM equipements WHERE statut = 'En panne'")->fetchColumn();
        $nb_ots   = $pdo->query("SELECT COUNT(*) FROM interventions WHERE statut_ot != 'Clôturé'")->fetchColumn();
        ?>

        <div class="stats-container">
            <div class="stat-card">
                <h3>Total Équipements</h3>
                <span class="number"><?= $nb_total ?></span>
            </div>
            <div class="stat-card" style="border-bottom: 4px solid #e74c3c;">
                <h3>Appareils en Panne</h3>
                <span class="number" style="color: #e74c3c;"><?= $nb_panne ?></span>
            </div>
            <div class="stat-card" style="border-bottom: 4px solid #f39c12;">
                <h3>OT en Cours</h3>
                <span class="number" style="color: #f39c12;"><?= $nb_ots ?></span>
            </div>
        </div>

        <h2>🚨 Derniers équipements signalés en panne</h2>
        <table>
            <tr><th>Nom</th><th>Service</th><th>Date Panne</th></tr>
            <?php
            $pannes = $pdo->query("SELECT * FROM equipements WHERE statut='En panne' LIMIT 5")->fetchAll();
            foreach($pannes as $p): ?>
            <tr>
                <td><?= $p['nom'] ?></td>
                <td><?= $p['service'] ?></td>
                <td style="color:red; font-weight:bold;">En panne</td>
            </tr>
            <?php endforeach; ?>
        </table>
    </div>

</body>
</html>