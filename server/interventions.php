<?php 
include 'db.php'; 

// CRÉATION D'UN OT
if (isset($_POST['create_ot'])) {
    $sql = "INSERT INTO interventions (equipement_id, type_maint, description, priorite, technicien, statut_ot) VALUES (?, ?, ?, ?, ?, 'Ouvert')";
    $pdo->prepare($sql)->execute([$_POST['eq_id'], $_POST['type'], $_POST['desc'], $_POST['prio'], $_POST['tech']]);
    
    // Update statut équipement
    if($_POST['type'] == 'Corrective') {
        $pdo->prepare("UPDATE equipements SET statut='En panne' WHERE id=?")->execute([$_POST['eq_id']]);
    }
    header("Location: interventions.php");
}

// CLÔTURE D'UN OT
if (isset($_POST['close_ot'])) {
    $sql = "UPDATE interventions SET cause_panne=?, actions_prises=?, date_cloture=NOW(), statut_ot='Clôturé' WHERE id=?";
    $pdo->prepare($sql)->execute([$_POST['cause'], $_POST['actions'], $_POST['ot_id']]);
    header("Location: interventions.php");
}
?>

<!DOCTYPE html>
<html lang="fr">
<head>
    <meta charset="UTF-8">
    <title>GMAO - Interventions</title>
    <link rel="stylesheet" href="style.css">
</head>
<body>

    <div class="sidebar">
        <h2>🏥 GMAO Hôpital</h2>
        <a href="index.php">📊 Tableau de Bord</a>
        <a href="equipements.php">📦 Équipements</a>
        <a href="interventions.php" class="active">🔧 Interventions</a>
    </div>

    <div class="content">
        <h1>Gestion des Interventions</h1>

        <!-- FORMULAIRE CRÉATION RAPIDE -->
        <div class="form-container">
            <h3>🆕 Nouvel Ordre de Travail (OT)</h3>
            <form method="post">
                <div class="form-row">
                    <select name="eq_id" required>
                        <option value="">-- Choisir l'équipement --</option>
                        <?php
                        $eqs = $pdo->query("SELECT id, nom, num_serie FROM equipements")->fetchAll();
                        foreach($eqs as $e) echo "<option value='{$e['id']}'>{$e['nom']} ({$e['num_serie']})</option>";
                        ?>
                    </select>
                    <select name="type">
                        <option value="Corrective">Corrective (Panne)</option>
                        <option value="Préventive">Préventive</option>
                    </select>
                </div>
                <div class="form-row">
                    <input type="text" name="desc" placeholder="Description du problème" required>
                    <select name="prio"><option>Normale</option><option>Urgente</option></select>
                    <input type="text" name="tech" placeholder="Technicien" required>
                </div>
                <button type="submit" name="create_ot" class="btn btn-add">Créer l'OT</button>
            </form>
        </div>

        <h3>🛠️ OTs en cours</h3>
        <table>
            <tr><th>ID OT</th> <th>Équipement</th> <th>Description</th> <th>Technicien</th> <th>Action</th></tr>
            <?php
            $ots = $pdo->query("SELECT i.*, e.nom FROM interventions i JOIN equipements e ON i.equipement_id = e.id WHERE i.statut_ot != 'Clôturé'")->fetchAll();
            foreach($ots as $ot):
            ?>
            <tr>
                <td>#<?= $ot['id'] ?></td>
                <td><?= $ot['nom'] ?></td>
                <td><?= $ot['description'] ?></td>
                <td><?= $ot['technicien'] ?></td>
                <td>
                    <!-- Petit formulaire inline pour clôturer -->
                    <form method="post" style="display:flex; gap:5px;">
                        <input type="hidden" name="ot_id" value="<?= $ot['id'] ?>">
                        <input type="text" name="cause" placeholder="Cause" required style="width:100px;">
                        <input type="text" name="actions" placeholder="Actions" required style="width:100px;">
                        <button type="submit" name="close_ot" class="btn btn-add" style="font-size:12px;">Clôturer</button>
                    </form>
                </td>
            </tr>
            <?php endforeach; ?>
        </table>
    </div>

</body>
</html>