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

    $stmt = $pdo->query("SELECT * FROM equipements ORDER BY created_at DESC");
    $equipements = $stmt->fetchAll();

    jsonResponse($equipements);
}

function getOne($id) {
    global $pdo;

    $stmt = $pdo->prepare("SELECT * FROM equipements WHERE id = ?");
    $stmt->execute([$id]);
    $equipement = $stmt->fetch();

    if (!$equipement) {
        jsonResponse(['error' => 'Equipment not found'], 404);
    }

    jsonResponse($equipement);
}

function create($input) {
    global $pdo;

    $nom = $input['nom'] ?? '';
    $marque = $input['marque'] ?? null;
    $modele = $input['modele'] ?? null;
    $num_serie = $input['num_serie'] ?? null;
    $service = $input['service'] ?? 'Réanimation';
    $statut = $input['statut'] ?? 'En service';
    $criticite = $input['criticite'] ?? 'Moyenne';

    if (empty($nom)) {
        jsonResponse(['error' => 'Name is required'], 400);
    }

    $stmt = $pdo->prepare("
        INSERT INTO equipements (id, nom, marque, modele, num_serie, service, statut, criticite)
        VALUES (UUID(), ?, ?, ?, ?, ?, ?, ?)
    ");

    $stmt->execute([$nom, $marque, $modele, $num_serie, $service, $statut, $criticite]);

    $id = $pdo->lastInsertId();
    $stmt = $pdo->prepare("SELECT * FROM equipements WHERE id = ?");
    $stmt->execute([$id]);
    $equipement = $stmt->fetch();

    jsonResponse($equipement, 201);
}

function update($id, $input) {
    global $pdo;

    if (!$id) {
        jsonResponse(['error' => 'ID is required'], 400);
    }

    $nom = $input['nom'] ?? '';
    $marque = $input['marque'] ?? null;
    $modele = $input['modele'] ?? null;
    $num_serie = $input['num_serie'] ?? null;
    $service = $input['service'] ?? '';
    $statut = $input['statut'] ?? '';

    $stmt = $pdo->prepare("
        UPDATE equipements
        SET nom = ?, marque = ?, modele = ?, num_serie = ?, service = ?, statut = ?
        WHERE id = ?
    ");

    $stmt->execute([$nom, $marque, $modele, $num_serie, $service, $statut, $id]);

    $stmt = $pdo->prepare("SELECT * FROM equipements WHERE id = ?");
    $stmt->execute([$id]);
    $equipement = $stmt->fetch();

    jsonResponse($equipement);
}

function delete($id) {
    global $pdo;

    if (!$id) {
        jsonResponse(['error' => 'ID is required'], 400);
    }

    $stmt = $pdo->prepare("DELETE FROM equipements WHERE id = ?");
    $stmt->execute([$id]);

    jsonResponse(['message' => 'Equipment deleted successfully']);
}
