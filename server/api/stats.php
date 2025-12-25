<?php
require_once '../config.php';
requireAuth();

$method = $_SERVER['REQUEST_METHOD'];

if ($method === 'GET') {
    global $pdo;

    $stmt = $pdo->query("SELECT COUNT(*) as total FROM equipements");
    $total = $stmt->fetch()['total'];

    $stmt = $pdo->query("SELECT COUNT(*) as enPanne FROM equipements WHERE statut = 'En panne'");
    $enPanne = $stmt->fetch()['enPanne'];

    $stmt = $pdo->query("SELECT COUNT(*) as enMaintenance FROM equipements WHERE statut = 'En maintenance'");
    $enMaintenance = $stmt->fetch()['enMaintenance'];

    $stmt = $pdo->query("SELECT COUNT(*) as otsOuverts FROM interventions WHERE statut_ot != 'Clôturé'");
    $otsOuverts = $stmt->fetch()['otsOuverts'];

    jsonResponse([
        'total' => (int)$total,
        'enPanne' => (int)$enPanne,
        'enMaintenance' => (int)$enMaintenance,
        'otsOuverts' => (int)$otsOuverts
    ]);
} else {
    jsonResponse(['error' => 'Method not allowed'], 405);
}
