<?php
require_once __DIR__ . '/../config/db.php';

header('Content-Type: application/json');

$method = $_SERVER['REQUEST_METHOD'];
$user = authenticate();
$userId = $user['id'];

if ($method === 'GET') {
    // Get user's cart
    $stmt = $pdo->prepare("
        SELECT c.*, p.name, p.price, p.image_url
        FROM cart c
        JOIN products p ON c.product_id = p.id
        WHERE c.user_id = ?
    ");
    $stmt->execute([$userId]);
    $cartItems = $stmt->fetchAll(PDO::FETCH_ASSOC);
    echo json_encode($cartItems);
} elseif ($method === 'POST') {
    // Add item to cart
    $data = json_decode(file_get_contents('php://input'), true);
    $productId = $data['product_id'] ?? '';
    $quantity = $data['quantity'] ?? 1;

    if (empty($productId)) {
        http_response_code(400);
        echo json_encode(['message' => 'Product ID required']);
        exit();
    }

    // Check if item already in cart
    $stmt = $pdo->prepare("SELECT id, quantity FROM cart WHERE user_id = ? AND product_id = ?");
    $stmt->execute([$userId, $productId]);
    $existingItem = $stmt->fetch(PDO::FETCH_ASSOC);

    if ($existingItem) {
        // Update quantity
        $newQuantity = $existingItem['quantity'] + $quantity;
        $stmt = $pdo->prepare("UPDATE cart SET quantity = ? WHERE id = ?");
        $stmt->execute([$newQuantity, $existingItem['id']]);
    } else {
        // Add new item
        $stmt = $pdo->prepare("INSERT INTO cart (user_id, product_id, quantity) VALUES (?, ?, ?)");
        $stmt->execute([$userId, $productId, $quantity]);
    }

    echo json_encode(['message' => 'Item added to cart']);
} elseif ($method === 'PUT') {
    // Update cart item quantity
    $data = json_decode(file_get_contents('php://input'), true);
    $productId = $data['product_id'] ?? '';
    $quantity = $data['quantity'] ?? 1;

    if (empty($productId)) {
        http_response_code(400);
        echo json_encode(['message' => 'Product ID required']);
        exit();
    }

    $stmt = $pdo->prepare("UPDATE cart SET quantity = ? WHERE user_id = ? AND product_id = ?");
    $stmt->execute([$quantity, $userId, $productId]);
    echo json_encode(['message' => 'Cart updated']);
} elseif ($method === 'DELETE') {
    // Remove item from cart
    $productId = $_GET['product_id'] ?? '';

    if (empty($productId)) {
        http_response_code(400);
        echo json_encode(['message' => 'Product ID required']);
        exit();
    }

    $stmt = $pdo->prepare("DELETE FROM cart WHERE user_id = ? AND product_id = ?");
    $stmt->execute([$userId, $productId]);
    echo json_encode(['message' => 'Item removed from cart']);
} else {
    http_response_code(405);
    echo json_encode(['message' => 'Method not allowed']);
}
?>
