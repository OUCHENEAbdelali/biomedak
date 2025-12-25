<?php
// Allow the React frontend to access this API
header("Access-Control-Allow-Origin: http://localhost:5173");
header("Access-Control-Allow-Methods: GET, POST, OPTIONS, PUT, DELETE");
header("Access-Control-Allow-Headers: Content-Type, Authorization, X-Requested-With");
header("Access-Control-Allow-Credentials: true");

// Handle the "Preflight" request (the browser sends this first)
if ($_SERVER['REQUEST_METHOD'] == 'OPTIONS') {
    http_response_code(200);
    exit;
}

// ... the rest of your existing code starts here
require_once '../config.php';

$method = $_SERVER['REQUEST_METHOD'];
$input = json_decode(file_get_contents('php://input'), true);

switch($method) {
    case 'POST':
        $action = $_GET['action'] ?? '';

        if ($action === 'login') {
            login($input);
        } elseif ($action === 'register') {
            register($input);
        } elseif ($action === 'logout') {
            logout();
        }
        break;

    case 'GET':
        checkSession();
        break;

    default:
        jsonResponse(['error' => 'Method not allowed'], 405);
}

function login($input) {
    global $pdo;

    $email = $input['email'] ?? '';
    $password = $input['password'] ?? '';

    if (empty($email) || empty($password)) {
        jsonResponse(['error' => 'Email and password required'], 400);
    }

    $stmt = $pdo->prepare("SELECT * FROM users WHERE email = ?");
    $stmt->execute([$email]);
    $user = $stmt->fetch();

    if (!$user || !password_verify($password, $user['password_hash'])) {
        jsonResponse(['error' => 'Invalid credentials'], 401);
    }

    $_SESSION['user_id'] = $user['id'];
    $_SESSION['user_email'] = $user['email'];
    $_SESSION['user_name'] = $user['full_name'];
    $_SESSION['user_role'] = $user['role'];

    jsonResponse([
        'user' => [
            'id' => $user['id'],
            'email' => $user['email'],
            'full_name' => $user['full_name'],
            'role' => $user['role']
        ]
    ]);
}

function register($input) {
    global $pdo;

    $email = $input['email'] ?? '';
    $password = $input['password'] ?? '';
    $fullName = $input['fullName'] ?? '';

    if (empty($email) || empty($password)) {
        jsonResponse(['error' => 'Email and password required'], 400);
    }

    $stmt = $pdo->prepare("SELECT id FROM users WHERE email = ?");
    $stmt->execute([$email]);
    if ($stmt->fetch()) {
        jsonResponse(['error' => 'Email already exists'], 400);
    }

    $passwordHash = password_hash($password, PASSWORD_DEFAULT);

    $stmt = $pdo->prepare("INSERT INTO users (id, email, password_hash, full_name, role) VALUES (UUID(), ?, ?, ?, 'Technicien')");
    $stmt->execute([$email, $passwordHash, $fullName]);

    jsonResponse(['message' => 'User registered successfully'], 201);
}

function logout() {
    session_destroy();
    jsonResponse(['message' => 'Logged out successfully']);
}

function checkSession() {
    if (isset($_SESSION['user_id'])) {
        jsonResponse([
            'user' => [
                'id' => $_SESSION['user_id'],
                'email' => $_SESSION['user_email'],
                'full_name' => $_SESSION['user_name'],
                'role' => $_SESSION['user_role']
            ]
        ]);
    } else {
        jsonResponse(['user' => null]);
    }
}
