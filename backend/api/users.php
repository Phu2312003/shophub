<?php
require_once __DIR__ . '/../config/db.php';

header('Content-Type: application/json');

$method = $_SERVER['REQUEST_METHOD'];
$user = authenticate();

if ($user['role'] !== 'admin') {
    http_response_code(403);
    echo json_encode(['message' => 'Admin access required']);
    exit();
}

if ($method === 'GET') {
    // Get all users
    $stmt = $pdo->query("SELECT id, name, email, role, created_at FROM users ORDER BY created_at DESC");
    $users = $stmt->fetchAll(PDO::FETCH_ASSOC);
    echo json_encode($users);
} else {
    http_response_code(405);
    echo json_encode(['message' => 'Method not allowed']);
}
?>
