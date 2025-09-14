<?php
header('Access-Control-Allow-Origin: *');
header('Access-Control-Allow-Methods: GET, POST, PUT, DELETE, OPTIONS');
header('Access-Control-Allow-Headers: Content-Type, Authorization');

if ($_SERVER['REQUEST_METHOD'] == 'OPTIONS') {
    exit(0);
}

$request_uri = $_SERVER['REQUEST_URI'];

if (strpos($request_uri, '/api/auth') === 0) {
    include 'api/auth.php';
} elseif (strpos($request_uri, '/api/products') === 0) {
    include 'api/products.php';
} elseif (strpos($request_uri, '/api/cart') === 0) {
    include 'api/cart.php';
} elseif (strpos($request_uri, '/api/orders') === 0) {
    include 'api/orders.php';
} elseif (strpos($request_uri, '/api/users') === 0) {
    include 'api/users.php';
} else {
    http_response_code(404);
    echo json_encode(['message' => 'Not found']);
}
?>
