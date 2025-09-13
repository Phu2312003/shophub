<?php
require_once 'config/db.php';

header('Content-Type: application/json');

// Test database connection
try {
    $stmt = $pdo->query("SELECT COUNT(*) as user_count FROM users");
    $result = $stmt->fetch(PDO::FETCH_ASSOC);
    echo "Database connected successfully!\n";
    echo "Total users: " . $result['user_count'] . "\n";

    // Show sample users
    $stmt = $pdo->query("SELECT id, name, email, role FROM users");
    $users = $stmt->fetchAll(PDO::FETCH_ASSOC);

    echo "\nUsers in database:\n";
    foreach ($users as $user) {
        echo "- {$user['name']} ({$user['email']}) - Role: {$user['role']}\n";
    }

    // Test password verification
    echo "\nTesting password verification:\n";
    $stmt = $pdo->prepare("SELECT password FROM users WHERE email = ?");
    $stmt->execute(['admin@example.com']);
    $adminUser = $stmt->fetch(PDO::FETCH_ASSOC);

    if ($adminUser) {
        $isValid = password_verify('password', $adminUser['password']);
        echo "Admin password verification: " . ($isValid ? 'SUCCESS' : 'FAILED') . "\n";
    }

} catch(PDOException $e) {
    echo "Database error: " . $e->getMessage() . "\n";
}
?>
