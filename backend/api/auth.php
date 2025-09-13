<?php
require_once __DIR__ . '/../config/db.php';

header('Content-Type: application/json');

$method = $_SERVER['REQUEST_METHOD'];
$action = $_GET['action'] ?? '';

if ($method === 'POST') {
    $data = json_decode(file_get_contents('php://input'), true);

    if ($action === 'register') {
        $name = $data['name'] ?? '';
        $email = $data['email'] ?? '';
        $password = $data['password'] ?? '';

        if (empty($name) || empty($email) || empty($password)) {
            http_response_code(400);
            echo json_encode(['message' => 'All fields are required']);
            exit();
        }

        $hashedPassword = password_hash($password, PASSWORD_DEFAULT);

        try {
            $stmt = $pdo->prepare("INSERT INTO users (name, email, password) VALUES (?, ?, ?)");
            $stmt->execute([$name, $email, $hashedPassword]);

            $userId = $pdo->lastInsertId();
            $user = ['id' => $userId, 'name' => $name, 'email' => $email, 'role' => 'user'];
            $token = generateToken($user);

            echo json_encode(['token' => $token, 'user' => $user]);
        } catch(PDOException $e) {
            http_response_code(400);
            echo json_encode(['message' => 'Email already exists']);
        }
    } elseif ($action === 'login') {
        $email = $data['email'] ?? '';
        $password = $data['password'] ?? '';

        if (empty($email) || empty($password)) {
            http_response_code(400);
            echo json_encode(['message' => 'Email and password are required']);
            exit();
        }

        try {
            $stmt = $pdo->prepare("SELECT id, name, email, password, role FROM users WHERE email = ?");
            $stmt->execute([$email]);
            $user = $stmt->fetch(PDO::FETCH_ASSOC);

            if ($user) {
                // Debug: Log password verification
                $passwordMatch = password_verify($password, $user['password']);

                if ($passwordMatch) {
                    unset($user['password']);
                    $token = generateToken($user);
                    echo json_encode([
                        'token' => $token,
                        'user' => $user,
                        'message' => 'Login successful'
                    ]);
                } else {
                    http_response_code(401);
                    echo json_encode(['message' => 'Invalid password']);
                }
            } else {
                http_response_code(401);
                echo json_encode(['message' => 'User not found']);
            }
        } catch(PDOException $e) {
            http_response_code(500);
            echo json_encode(['message' => 'Database error: ' . $e->getMessage()]);
        }
    } elseif ($action === 'logout') {
        // For stateless JWT, logout is handled on client side
        echo json_encode(['message' => 'Logged out']);
    } else {
        http_response_code(400);
        echo json_encode(['message' => 'Invalid action']);
    }
} elseif ($method === 'GET' && $action === 'test') {
    // Test endpoint to check database connection and users
    try {
        $stmt = $pdo->query("SELECT COUNT(*) as user_count FROM users");
        $result = $stmt->fetch(PDO::FETCH_ASSOC);

        $stmt = $pdo->query("SELECT id, name, email, role FROM users LIMIT 5");
        $users = $stmt->fetchAll(PDO::FETCH_ASSOC);

        echo json_encode([
            'status' => 'Database connected successfully',
            'user_count' => $result['user_count'],
            'sample_users' => $users
        ]);
    } catch(PDOException $e) {
        http_response_code(500);
        echo json_encode(['error' => 'Database error: ' . $e->getMessage()]);
    }
} elseif ($method === 'GET' && $action === 'debug') {
    // Debug endpoint to test password verification
    $email = $_GET['email'] ?? 'admin@example.com';
    $password = $_GET['password'] ?? 'password';

    try {
        $stmt = $pdo->prepare("SELECT id, name, email, password, role FROM users WHERE email = ?");
        $stmt->execute([$email]);
        $user = $stmt->fetch(PDO::FETCH_ASSOC);

        if ($user) {
            $passwordMatch = password_verify($password, $user['password']);
            unset($user['password']);

            echo json_encode([
                'user_found' => true,
                'user' => $user,
                'password_match' => $passwordMatch,
                'test_email' => $email,
                'test_password' => $password
            ]);
        } else {
            echo json_encode([
                'user_found' => false,
                'test_email' => $email
            ]);
        }
    } catch(PDOException $e) {
        http_response_code(500);
        echo json_encode(['error' => 'Database error: ' . $e->getMessage()]);
    }
} else {
    http_response_code(405);
    echo json_encode(['message' => 'Method not allowed']);
}
?>
