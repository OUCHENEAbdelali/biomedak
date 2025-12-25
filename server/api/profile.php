<?php
require_once '../config.php';
requireAuth();

$method = $_SERVER['REQUEST_METHOD'];
$input = json_decode(file_get_contents('php://input'), true);

switch($method) {
    case 'PUT':
        updateProfile($input);
        break;

    default:
        jsonResponse(['error' => 'Method not allowed'], 405);
}

function updateProfile($input) {
    global $pdo;

    $userId = $_SESSION['user_id'];
    $fullName = $input['full_name'] ?? '';

    if (empty($fullName)) {
        jsonResponse(['error' => 'Full name is required'], 400);
    }

    try {
        $stmt = $pdo->prepare("UPDATE users SET full_name = ? WHERE id = ?");
        $stmt->execute([$fullName, $userId]);

        $_SESSION['user_name'] = $fullName;

        $stmt = $pdo->prepare("SELECT id, email, full_name, role FROM users WHERE id = ?");
        $stmt->execute([$userId]);
        $user = $stmt->fetch();

        jsonResponse([
            'message' => 'Profile updated successfully',
            'user' => [
                'id' => $user['id'],
                'email' => $user['email'],
                'full_name' => $user['full_name'],
                'role' => $user['role']
            ]
        ]);
    } catch (Exception $e) {
        jsonResponse(['error' => 'Failed to update profile'], 500);
    }
}
