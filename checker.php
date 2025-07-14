<?php
// ######## VERIFICADOR DE NOMBRES SOCIALES v1.8 (Versión Final Estable) ########
error_reporting(0);
header('Content-Type: application/json; charset=utf-8');

$username = filter_input(INPUT_GET, 'username', FILTER_SANITIZE_STRING);
$platform = filter_input(INPUT_GET, 'platform', FILTER_SANITIZE_STRING);

if (!$username || !$platform) {
    http_response_code(400);
    exit;
}

// ÚNICA PLATAFORMA FIABLE PARA VERIFICACIÓN AUTOMÁTICA
$urls = [
    'youtube'   => "https://www.youtube.com/@{$username}",
];

if (!array_key_exists($platform, $urls)) {
    http_response_code(400); // Rechaza cualquier otra plataforma
    exit;
}

$url = $urls[$platform];
$ch = curl_init();

curl_setopt_array($ch, [
    CURLOPT_URL => $url,
    CURLOPT_RETURNTRANSFER => true,
    CURLOPT_FOLLOWLOCATION => true,
    CURLOPT_MAXREDIRS => 10,
    CURLOPT_TIMEOUT => 15,
    CURLOPT_USERAGENT => 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/114.0.0.0 Safari/537.36',
    CURLOPT_SSL_VERIFYPEER => false,
]);

curl_exec($ch);

if(curl_errno($ch)){
    http_response_code(500);
    exit;
}

$http_code = curl_getinfo($ch, CURLINFO_HTTP_CODE);
curl_close($ch);

if ($http_code == 404) {
    echo json_encode(['status' => 'available']);
} else {
    echo json_encode(['status' => 'unavailable_or_blocked']);
}
?>