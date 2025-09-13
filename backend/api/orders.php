<?php
require_once __DIR__ . '/../config/db.php';

header('Content-Type: application/json');

$method = $_SERVER['REQUEST_METHOD'];
$user = authenticate();
$userId = $user['id'];
$id = $_GET['id'] ?? null;
$admin = $_GET['admin'] ?? false;

if ($method === 'GET') {
    if ($admin && $user['role'] === 'admin') {
        // Admin: Get all orders
        $stmt = $pdo->prepare("
            SELECT o.*, u.name as user_name
            FROM orders o
            JOIN users u ON o.user_id = u.id
            ORDER BY o.created_at DESC
        ");
        $stmt->execute();
        $orders = $stmt->fetchAll(PDO::FETCH_ASSOC);
        echo json_encode($orders);
    } else {
        // User: Get user's orders with items
        $stmt = $pdo->prepare("SELECT * FROM orders WHERE user_id = ? ORDER BY created_at DESC");
        $stmt->execute([$userId]);
        $orders = $stmt->fetchAll(PDO::FETCH_ASSOC);

        foreach ($orders as &$order) {
            $stmt = $pdo->prepare("
                SELECT oi.*, p.name
                FROM order_items oi
                JOIN products p ON oi.product_id = p.id
                WHERE oi.order_id = ?
            ");
            $stmt->execute([$order['id']]);
            $order['items'] = $stmt->fetchAll(PDO::FETCH_ASSOC);
        }

        echo json_encode($orders);
    }
} elseif ($method === 'POST') {
    // Create new order from cart
    $data = json_decode(file_get_contents('php://input'), true);
    $shippingAddress = $data['shipping_address'] ?? '';

    if (empty($shippingAddress)) {
        http_response_code(400);
        echo json_encode(['message' => 'Shipping address required']);
        exit();
    }

    // Get cart items
    $stmt = $pdo->prepare("
        SELECT c.*, p.price
        FROM cart c
        JOIN products p ON c.product_id = p.id
        WHERE c.user_id = ?
    ");
    $stmt->execute([$userId]);
    $cartItems = $stmt->fetchAll(PDO::FETCH_ASSOC);

    if (empty($cartItems)) {
        http_response_code(400);
        echo json_encode(['message' => 'Cart is empty']);
        exit();
    }

    // Calculate total
    $total = 0;
    foreach ($cartItems as $item) {
        $total += $item['price'] * $item['quantity'];
    }

    // Create order
    $pdo->beginTransaction();
    try {
        $stmt = $pdo->prepare("INSERT INTO orders (user_id, total) VALUES (?, ?)");
        $stmt->execute([$userId, $total]);
        $orderId = $pdo->lastInsertId();

        // Add order items
        foreach ($cartItems as $item) {
            $stmt = $pdo->prepare("INSERT INTO order_items (order_id, product_id, quantity, price) VALUES (?, ?, ?, ?)");
            $stmt->execute([$orderId, $item['product_id'], $item['quantity'], $item['price']]);
        }

        // Clear cart
        $stmt = $pdo->prepare("DELETE FROM cart WHERE user_id = ?");
        $stmt->execute([$userId]);

        $pdo->commit();
        echo json_encode(['message' => 'Order placed successfully', 'order_id' => $orderId]);
    } catch(PDOException $e) {
        $pdo->rollBack();
        http_response_code(400);
        echo json_encode(['message' => 'Failed to place order']);
    }
} elseif ($method === 'PUT') {
    // Update order status (admin only)
    if ($user['role'] !== 'admin') {
        http_response_code(403);
        echo json_encode(['message' => 'Admin access required']);
        exit();
    }

    if (!$id) {
        http_response_code(400);
        echo json_encode(['message' => 'Order ID required']);
        exit();
    }

    $data = json_decode(file_get_contents('php://input'), true);
    $status = $data['status'] ?? '';

    if (empty($status)) {
        http_response_code(400);
        echo json_encode(['message' => 'Status required']);
        exit();
    }

    try {
        $stmt = $pdo->prepare("UPDATE orders SET status = ? WHERE id = ?");
        $stmt->execute([$status, $id]);
        echo json_encode(['message' => 'Order status updated']);
    } catch(PDOException $e) {
        http_response_code(400);
        echo json_encode(['message' => 'Failed to update order']);
    }
} else {
    http_response_code(405);
    echo json_encode(['message' => 'Method not allowed']);
}
?>
