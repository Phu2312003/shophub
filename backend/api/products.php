<?php
require_once __DIR__ . '/../config/db.php';

header('Content-Type: application/json');

$method = $_SERVER['REQUEST_METHOD'];
$id = $_GET['id'] ?? null;

if ($method === 'GET') {
    if ($id) {
        // Get single product
        $stmt = $pdo->prepare("SELECT * FROM products WHERE id = ?");
        $stmt->execute([$id]);
        $product = $stmt->fetch(PDO::FETCH_ASSOC);

        if ($product) {
            echo json_encode($product);
        } else {
            http_response_code(404);
            echo json_encode(['message' => 'Product not found']);
        }
    } else {
        // Get all products
        $stmt = $pdo->query("SELECT * FROM products ORDER BY created_at DESC");
        $products = $stmt->fetchAll(PDO::FETCH_ASSOC);
        echo json_encode($products);
    }
} elseif ($method === 'POST') {
    // Add new product (admin only)
    $user = authenticate();
    if ($user['role'] !== 'admin') {
        http_response_code(403);
        echo json_encode(['message' => 'Admin access required']);
        exit();
    }

    $data = json_decode(file_get_contents('php://input'), true);
    $name = $data['name'] ?? '';
    $description = $data['description'] ?? '';
    $price = $data['price'] ?? '';
    $stock = $data['stock'] ?? '';
    $image_url = $data['image_url'] ?? '';

    if (empty($name) || empty($price) || empty($stock)) {
        http_response_code(400);
        echo json_encode(['message' => 'Name, price, and stock are required']);
        exit();
    }

    try {
        $stmt = $pdo->prepare("INSERT INTO products (name, description, price, stock, image_url) VALUES (?, ?, ?, ?, ?)");
        $stmt->execute([$name, $description, $price, $stock, $image_url]);
        echo json_encode(['message' => 'Product added successfully', 'id' => $pdo->lastInsertId()]);
    } catch(PDOException $e) {
        http_response_code(400);
        echo json_encode(['message' => 'Failed to add product']);
    }
} elseif ($method === 'PUT') {
    // Update product (admin only)
    $user = authenticate();
    if ($user['role'] !== 'admin') {
        http_response_code(403);
        echo json_encode(['message' => 'Admin access required']);
        exit();
    }

    if (!$id) {
        http_response_code(400);
        echo json_encode(['message' => 'Product ID required']);
        exit();
    }

    $data = json_decode(file_get_contents('php://input'), true);
    $name = $data['name'] ?? '';
    $description = $data['description'] ?? '';
    $price = $data['price'] ?? '';
    $stock = $data['stock'] ?? '';
    $image_url = $data['image_url'] ?? '';

    try {
        $stmt = $pdo->prepare("UPDATE products SET name = ?, description = ?, price = ?, stock = ?, image_url = ? WHERE id = ?");
        $stmt->execute([$name, $description, $price, $stock, $image_url, $id]);
        echo json_encode(['message' => 'Product updated successfully']);
    } catch(PDOException $e) {
        http_response_code(400);
        echo json_encode(['message' => 'Failed to update product']);
    }
} elseif ($method === 'DELETE') {
    // Delete product (admin only)
    $user = authenticate();
    if ($user['role'] !== 'admin') {
        http_response_code(403);
        echo json_encode(['message' => 'Admin access required']);
        exit();
    }

    if (!$id) {
        http_response_code(400);
        echo json_encode(['message' => 'Product ID required']);
        exit();
    }

    try {
        $stmt = $pdo->prepare("DELETE FROM products WHERE id = ?");
        $stmt->execute([$id]);
        echo json_encode(['message' => 'Product deleted successfully']);
    } catch(PDOException $e) {
        http_response_code(400);
        echo json_encode(['message' => 'Failed to delete product']);
    }
} else {
    http_response_code(405);
    echo json_encode(['message' => 'Method not allowed']);
}
?>
