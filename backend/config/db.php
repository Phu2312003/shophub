<?php
header('Access-Control-Allow-Origin: *');
header('Access-Control-Allow-Methods: GET, POST, PUT, DELETE, OPTIONS');
header('Access-Control-Allow-Headers: Content-Type, Authorization');

if ($_SERVER['REQUEST_METHOD'] == 'OPTIONS') {
    exit(0);
}

$host = getenv('MYSQLHOST') ?: getenv('DB_HOST') ?: 'localhost';
$dbname = getenv('MYSQLDATABASE') ?: getenv('DB_NAME') ?: 'shop_db';
$username = getenv('MYSQLUSER') ?: getenv('DB_USER') ?: 'root';
$password = getenv('MYSQLPASSWORD') ?: getenv('DB_PASS') ?: '';

try {
    $pdo = new PDO("mysql:host=$host;dbname=$dbname", $username, $password);
    $pdo->setAttribute(PDO::ATTR_ERRMODE, PDO::ERRMODE_EXCEPTION);
} catch(PDOException $e) {
    die("Connection failed: " . $e->getMessage());
}

function authenticate() {
    $headers = getallheaders();
    if (!isset($headers['Authorization'])) {
        http_response_code(401);
        echo json_encode(['message' => 'No token provided']);
        exit();
    }

    $token = str_replace('Bearer ', '', $headers['Authorization']);
    $payload = json_decode(base64_decode($token), true);

    if (!$payload || !isset($payload['user'])) {
        http_response_code(401);
        echo json_encode(['message' => 'Invalid token']);
        exit();
    }

    // Check if token is expired
    if (isset($payload['exp']) && $payload['exp'] < time()) {
        http_response_code(401);
        echo json_encode(['message' => 'Token expired']);
        exit();
    }

    return $payload['user'];
}

function generateToken($user) {
    // Create a more secure token with timestamp
    $payload = [
        'user' => $user,
        'iat' => time(),
        'exp' => time() + (24 * 60 * 60) // 24 hours
    ];
    return base64_encode(json_encode($payload));
}
?>
