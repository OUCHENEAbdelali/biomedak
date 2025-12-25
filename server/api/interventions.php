<?php
require_once '../config.php';
requireAuth();

$method = $_SERVER['REQUEST_METHOD'];
$input = json_decode(file_get_contents('php://input'), true);
$id = $_GET['id'] ?? null;

switch($method) {
    case 'GET':
        if ($id) {
            getOne($id);
        } else {
            getAll();
        }
        break;

    case 'POST':
        create($input);
        break;

    case 'PUT':
        update($id, $input);
        break;

    case 'DELETE':
        delete($id);
        break;

    default:
        jsonResponse(['error' => 'Method not allowed'], 405);
}

function getAll() {
    global $pdo;

    $stmt = $pdo->query("
        SELECT i.*, e.nom as equipement_nom
        FROM interventions i
        LEFT JOIN equipements e ON i.equipement_id = e.id
        ORDER BY i.created_at DESC
    ");

    $interventions = $stmt->fetchAll();

    $result = array_map(function($int) {
        return [
            'id' => $int['id'],
            'equipement_id' => $int['equipement_id'],
            'type_maint' => $int['type_maint'],
            'description' => $int['description'],
            'priorite' => $int['priorite'],
            'technicien' => $int['technicien'],
            'statut_ot' => $int['statut_ot'],
            'cause_panne' => $int['cause_panne'],
            'actions_prises' => $int['actions_prises'],
            'date_creation' => $int['date_creation'],
            'date_cloture' => $int['date_cloture'],
            'created_at' => $int['created_at'],
            'equipement' => ['nom' => $int['equipement_nom']]
        ];
    }, $interventions);

    jsonResponse($result);
}

function getOne($id) {
    global $pdo;

    $stmt = $pdo->prepare("
        SELECT i.*, e.nom as equipement_nom
        FROM interventions i
        LEFT JOIN equipements e ON i.equipement_id = e.id
        WHERE i.id = ?
    ");
    $stmt->execute([$id]);
    $int = $stmt->fetch();

    if (!$int) {
        jsonResponse(['error' => 'Intervention not found'], 404);
    }

    $result = [
        'id' => $int['id'],
        'equipement_id' => $int['equipement_id'],
        'type_maint' => $int['type_maint'],
        'description' => $int['description'],
        'priorite' => $int['priorite'],
        'technicien' => $int['technicien'],
        'statut_ot' => $int['statut_ot'],
        'cause_panne' => $int['cause_panne'],
        'actions_prises' => $int['actions_prises'],
        'date_creation' => $int['date_creation'],
        'date_cloture' => $int['date_cloture'],
        'created_at' => $int['created_at'],
        'equipement' => ['nom' => $int['equipement_nom']]
    ];

    jsonResponse($result);
}

function create($input) {
    global $pdo;

    $equipement_id = $input['equipement_id'] ?? '';
    $type_maint = $input['type_maint'] ?? 'Corrective';
    $description = $input['description'] ?? '';
    $priorite = $input['priorite'] ?? 'Normale';
    $technicien = $input['technicien'] ?? '';
    $statut_ot = $input['statut_ot'] ?? 'Ouvert';

    if (empty($equipement_id) || empty($description) || empty($technicien)) {
        jsonResponse(['error' => 'Missing required fields'], 400);
    }

    $pdo->beginTransaction();

    try {
        $stmt = $pdo->prepare("
            INSERT INTO interventions (id, equipement_id, type_maint, description, priorite, technicien, statut_ot)
            VALUES (UUID(), ?, ?, ?, ?, ?, ?)
        ");
        $stmt->execute([$equipement_id, $type_maint, $description, $priorite, $technicien, $statut_ot]);

        $stmt = $pdo->prepare("SELECT statut FROM equipements WHERE id = ?");
        $stmt->execute([$equipement_id]);
        $equipement = $stmt->fetch();

        if ($equipement && $equipement['statut'] === 'En panne') {
            $stmt = $pdo->prepare("UPDATE equipements SET statut = 'En maintenance' WHERE id = ?");
            $stmt->execute([$equipement_id]);
        } elseif ($type_maint === 'Corrective' && $equipement && $equipement['statut'] === 'En service') {
            $stmt = $pdo->prepare("UPDATE equipements SET statut = 'En panne' WHERE id = ?");
            $stmt->execute([$equipement_id]);
        }

        $pdo->commit();
        jsonResponse(['message' => 'Intervention created successfully'], 201);
    } catch (Exception $e) {
        $pdo->rollBack();
        jsonResponse(['error' => 'Failed to create intervention'], 500);
    }
}

function update($id, $input) {
    global $pdo;

    if (!$id) {
        jsonResponse(['error' => 'ID is required'], 400);
    }

    $stmt = $pdo->prepare("SELECT equipement_id FROM interventions WHERE id = ?");
    $stmt->execute([$id]);
    $intervention = $stmt->fetch();

    if (!$intervention) {
        jsonResponse(['error' => 'Intervention not found'], 404);
    }

    $pdo->beginTransaction();

    try {
        $cause_panne = $input['cause_panne'] ?? null;
        $actions_prises = $input['actions_prises'] ?? null;
        $statut_ot = $input['statut_ot'] ?? 'Ouvert';

        if ($statut_ot === 'Clôturé') {
            $stmt = $pdo->prepare("
                UPDATE interventions
                SET cause_panne = ?, actions_prises = ?, statut_ot = ?, date_cloture = NOW()
                WHERE id = ?
            ");
            $stmt->execute([$cause_panne, $actions_prises, $statut_ot, $id]);

            $stmt = $pdo->prepare("UPDATE equipements SET statut = 'En service' WHERE id = ?");
            $stmt->execute([$intervention['equipement_id']]);
        } else {
            $stmt = $pdo->prepare("
                UPDATE interventions
                SET cause_panne = ?, actions_prises = ?, statut_ot = ?
                WHERE id = ?
            ");
            $stmt->execute([$cause_panne, $actions_prises, $statut_ot, $id]);
        }

        $pdo->commit();
        jsonResponse(['message' => 'Intervention updated successfully']);
    } catch (Exception $e) {
        $pdo->rollBack();
        jsonResponse(['error' => 'Failed to update intervention'], 500);
    }
}

function delete($id) {
    global $pdo;

    if (!$id) {
        jsonResponse(['error' => 'ID is required'], 400);
    }

    $stmt = $pdo->prepare("DELETE FROM interventions WHERE id = ?");
    $stmt->execute([$id]);

    jsonResponse(['message' => 'Intervention deleted successfully']);
}
