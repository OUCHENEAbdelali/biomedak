<?php 
include 'db.php'; 

// --- LOGIQUE PHP ---

// 1. SUPPRESSION
if (isset($_GET['del'])) {
    $id = $_GET['del'];
    
    try {
        // Étape A : Supprimer d'abord toutes les interventions liées à cet équipement
        $pdo->prepare("DELETE FROM interventions WHERE equipement_id=?")->execute([$id]);
        
        // Étape B : Supprimer ensuite l'équipement lui-même
        $pdo->prepare("DELETE FROM equipements WHERE id=?")->execute([$id]);
        
        header("Location: equipements.php");
        exit;
    } catch (Exception $e) {
        die("Erreur lors de la suppression : " . $e->getMessage());
    }
}


// 2. AJOUT OU MODIFICATION
$edit_mode = false;
$eq_to_edit = null;

// Si on clique sur "Éditer", on récupère les infos
if (isset($_GET['edit'])) {
    $edit_mode = true;
    $stmt = $pdo->prepare("SELECT * FROM equipements WHERE id=?");
    $stmt->execute([$_GET['edit']]);
    $eq_to_edit = $stmt->fetch();
}

// Sauvegarde (Insert ou Update)
if (isset($_POST['save_equip'])) {
    $nom = $_POST['nom']; $marque = $_POST['marque']; $modele = $_POST['modele'];
    $serie = $_POST['serie']; $service = $_POST['service']; $statut = $_POST['statut'];

    if ($_POST['id_hidden']) {
        // UPDATE
        $sql = "UPDATE equipements SET nom=?, marque=?, modele=?, num_serie=?, service=?, statut=? WHERE id=?";
        $pdo->prepare($sql)->execute([$nom, $marque, $modele, $serie, $service, $statut, $_POST['id_hidden']]);
    } else {
        // INSERT
        $sql = "INSERT INTO equipements (nom, marque, modele, num_serie, service, date_acquisition, criticite, statut) VALUES (?,?,?,?,?, NOW(), 'Moyenne', ?)";
        $pdo->prepare($sql)->execute([$nom, $marque, $modele, $serie, $service, $statut]);
    }
    header("Location: equipements.php");
    exit;
}
?>

<!DOCTYPE html>
<html lang="fr">
<head>
    <meta charset="UTF-8">
    <title>Gestion Équipements</title>
    <link rel="stylesheet" href="style.css">
</head>
<body>

    <div class="sidebar">
        <h2>🏥 GMAO Hôpital</h2>
        <a href="index.php">📊 Tableau de Bord</a>
        <a href="equipements.php" class="active">📦 Équipements</a>
        <a href="interventions.php">🔧 Interventions</a>
    </div>

    <div class="content">
        <h1>Gestion du Parc</h1>

        <!-- FORMULAIRE (Sert pour AJOUT et EDITION) -->
        <div class="form-container">
            <h3><?= $edit_mode ? '✏️ Modifier Équipement' : '➕ Nouvel Équipement' ?></h3>
            <form method="post">
                <input type="hidden" name="id_hidden" value="<?= $eq_to_edit['id'] ?? '' ?>">
                <div class="form-row">
                    <input type="text" name="nom" placeholder="Nom" value="<?= $eq_to_edit['nom'] ?? '' ?>" required>
                    <input type="text" name="marque" placeholder="Marque" value="<?= $eq_to_edit['marque'] ?? '' ?>">
                    <input type="text" name="modele" placeholder="Modèle" value="<?= $eq_to_edit['modele'] ?? '' ?>">
                </div>
                <div class="form-row">
                    <input type="text" name="serie" placeholder="N° Série" value="<?= $eq_to_edit['num_serie'] ?? '' ?>">
                    <select name="service">
                        <option value="Réanimation" <?= ($eq_to_edit['service'] ?? '') == 'Réanimation' ? 'selected' : '' ?>>Réanimation</option>
                        <option value="Bloc" <?= ($eq_to_edit['service'] ?? '') == 'Bloc' ? 'selected' : '' ?>>Bloc Opératoire</option>
                        <option value="Urgences" <?= ($eq_to_edit['service'] ?? '') == 'Urgences' ? 'selected' : '' ?>>Urgences</option>
                    </select>
                    <select name="statut">
                        <option value="En service" <?= ($eq_to_edit['statut'] ?? '') == 'En service' ? 'selected' : '' ?>>En service</option>
                        <option value="En panne" <?= ($eq_to_edit['statut'] ?? '') == 'En panne' ? 'selected' : '' ?>>En panne</option>
                        <option value="En maintenance" <?= ($eq_to_edit['statut'] ?? '') == 'En maintenance' ? 'selected' : '' ?>>En maintenance</option>
                    </select>
                </div>
                <button type="submit" name="save_equip" class="btn btn-add"><?= $edit_mode ? 'Mettre à jour' : 'Ajouter' ?></button>
                <?php if($edit_mode): ?> <a href="equipements.php" class="btn" style="background:#7f8c8d">Annuler</a> <?php endif; ?>
            </form>
        </div>

        <!-- LISTE TABLEAU -->
        <table>
            <thead>
                <tr>
                    <th>ID</th> <th>Nom</th> <th>Marque</th> <th>Service</th> <th>Statut</th> <th>Actions</th>
                </tr>
            </thead>
            <tbody>
                <?php
                $equipements = $pdo->query("SELECT * FROM equipements ORDER BY id DESC")->fetchAll();
                foreach($equipements as $eq): 
                ?>
                <tr>
                    <td><?= $eq['id'] ?></td>
                    <td><?= $eq['nom'] ?></td>
                    <td><?= $eq['marque'] ?> - <?= $eq['modele'] ?></td>
                    <td><?= $eq['service'] ?></td>
                    <td>
                        <span style="padding:4px; border-radius:4px; color:white; background-color: <?= $eq['statut']=='En panne'?'#e74c3c':'#27ae60' ?>">
                            <?= $eq['statut'] ?>
                        </span>
                    </td>
                    <td>
                        <!-- Boutons avec liens GET -->
                        <a href="equipements.php?edit=<?= $eq['id'] ?>" class="btn btn-edit">Éditer</a>
                        <a href="equipements.php?del=<?= $eq['id'] ?>" class="btn btn-del" onclick="return confirm('Êtes-vous sûr de vouloir supprimer ? cela va supprimer toute intervention reliée a cet equipement !');">Supprimer</a>
                    </td>
                </tr>
                <?php endforeach; ?>
            </tbody>
        </table>
    </div>

</body>
</html>