<?php
// Simple API router for development
$request_uri = $_SERVER['REQUEST_URI'];
$query_string = $_SERVER['QUERY_STRING'] ?? '';

// Extract the API path
$path = parse_url($request_uri, PHP_URL_PATH);

// Handle different API endpoints
if (preg_match('/\/api\/([^?]+)/', $path, $matches)) {
    $endpoint = $matches[1];

    // Set the query string for the included file
    if ($query_string) {
        $_SERVER['QUERY_STRING'] = $query_string;
        parse_str($query_string, $_GET);
    }

    // Route to the appropriate backend API file
    switch ($endpoint) {
        case 'auth.php':
            require_once 'backend/api/auth.php';
            break;
        case 'products.php':
            require_once 'backend/api/products.php';
            break;
        case 'cart.php':
            require_once 'backend/api/cart.php';
            break;
        case 'orders.php':
            require_once 'backend/api/orders.php';
            break;
        case 'users.php':
            require_once 'backend/api/users.php';
            break;
        default:
            http_response_code(404);
            echo json_encode(['error' => 'API endpoint not found: ' . $endpoint]);
    }
} else {
    http_response_code(404);
    echo json_encode(['error' => 'Invalid API path']);
}
?>
