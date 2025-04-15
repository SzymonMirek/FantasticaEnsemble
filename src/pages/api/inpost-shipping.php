<?php
header('Content-Type: application/json');

// Your InPost API token (get this from your ShipX account)
$token = 'eyJhbGciOiJSUzI1NiIsInR5cCIgOiAiSldUIiwia2lkIiA6ICJzQlpXVzFNZzVlQnpDYU1XU3JvTlBjRWFveFpXcW9Ua2FuZVB3X291LWxvIn0.eyJleHAiOjIwNTk5MzI4MjEsImlhdCI6MTc0NDU3MjgyMSwianRpIjoiMmNjYzFiZmYtMDFhYy00YjNmLWI0ODMtN2Y1ODc3MWIxZTQwIiwiaXNzIjoiaHR0cHM6Ly9sb2dpbi5pbnBvc3QucGwvYXV0aC9yZWFsbXMvZXh0ZXJuYWwiLCJzdWIiOiJmOjEyNDc1MDUxLTFjMDMtNGU1OS1iYTBjLTJiNDU2OTVlZjUzNTo1YWN5QkJFN2gwdWxWZV9xQWFPeVJPYzk5d3JPTlV6UU5fWEtrbkJQYmU4IiwidHlwIjoiQmVhcmVyIiwiYXpwIjoic2hpcHgiLCJzZXNzaW9uX3N0YXRlIjoiYjQwYzFjZDktNzhhZi00YWFmLTljZGEtM2MyMTI5NDA1OTZjIiwic2NvcGUiOiJvcGVuaWQgYXBpOmFwaXBvaW50cyBhcGk6c2hpcHgiLCJzaWQiOiJiNDBjMWNkOS03OGFmLTRhYWYtOWNkYS0zYzIxMjk0MDU5NmMiLCJhbGxvd2VkX3JlZmVycmVycyI6IiIsInV1aWQiOiI4ZDM2OGQzYS04MGU0LTRiNGEtOGMwZi01MjhhZTcxYTAzZjMiLCJlbWFpbCI6Im93Y3pld29yeUBnbWFpbC5jb20ifQ.e6uTAA6GxNi9z2Q4mUdE_2oRSsvEvDanvpS559UNrVxlaswC0mKtq6xGYxnjtEqE0nBNf5kap7m8OFEckqqu3ZxlF1R330G4VALF5ylpMdp6oMSRe_Q95xdwBbo9NLcisPBetXT5pgEcisXkxStklMMdTITLGYxPmBsQ9sM1zEqP7BsSNXZcE0QUNZ0tWkS3pob8k8Fbi3-rsIXYka5S3Oyd85fxVjmXzbFXkHGjkI4WbQNaEVVHmFQeCwZBQKE3cGqJgoNwXNhWIkaeXCqBIAjPO37_fl37sqZI-';

// Get data from POST request
$data = json_decode(file_get_contents('php://input'), true);
$postalCode = $data['postalCode'];
$weight = $data['weight'];

// API endpoint for points near a postal code
$url = "https://api-shipx-it.easypack24.net/v1/points?relative_post_code=$postalCode&max_distance=2000";

// Initialize cURL
$ch = curl_init();
curl_setopt($ch, CURLOPT_URL, $url);
curl_setopt($ch, CURLOPT_RETURNTRANSFER, true);
curl_setopt($ch, CURLOPT_HTTPHEADER, [
    'Accept: application/json',
    'Authorization: Bearer ' . $token
]);

$response = curl_exec($ch);
curl_close($ch);

if ($response === false) {
    http_response_code(500);
    echo json_encode(['error' => 'Failed to connect to InPost API']);
    exit;
}

$points = json_decode($response, true);

if (!isset($points['items'])) {
    http_response_code(500);
    echo json_encode(['error' => 'Invalid response from InPost API']);
    exit;
}

// Format response for Snipcart
$rates = array_map(function($point) use ($weight) {
    return [
        'cost' => calculateCost($weight, $point),
        'description' => "InPost " . (strpos($point['type'], 'apm') !== false ? 'Locker' : 'PUP') . " - " . $point['address']['line1'],
        'userDefinedId' => 'inpost_' . $point['name']
    ];
}, $points['items']);

echo json_encode(['rates' => $rates]);

function calculateCost($weight, $point) {
    // Your pricing logic here
    return $weight < 1000 ? 9.99 : 12.99;
}
?>