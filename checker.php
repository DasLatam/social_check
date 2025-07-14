<?php
// Silenciar warnings para no interrumpir la respuesta JSON
error_reporting(0);
// Establecer la cabecera del contenido a JSON
header('Content-Type: application/json; charset=utf-8');

// Validar y sanear la entrada
$username = filter_input(INPUT_GET, 'username', FILTER_SANITIZE_STRING);
$platform = filter_input(INPUT_GET, 'platform', FILTER_SANITIZE_STRING);

if (!$username || !$platform) {
    http_response_code(400); // Bad Request
    echo json_encode(['status' => 'error', 'message' => 'Parámetros inválidos: se requiere username y platform.']);
    exit;
}

// URLs de las plataformas
$urls = [
    'facebook'  => "https://www.facebook.com/{$username}",
    'instagram' => "https://www.instagram.com/{$username}/",
    'tiktok'    => "https://www.tiktok.com/@{$username}",
    'x'         => "https://x.com/{$username}",
];

if (!array_key_exists($platform, $urls)) {
    http_response_code(400); // Bad Request
    echo json_encode(['status' => 'error', 'message' => 'Plataforma no soportada.']);
    exit;
}

$url = $urls[$platform];

// Inicializar cURL
$ch = curl_init();

// Establecer opciones de cURL
curl_setopt_array($ch, [
    CURLOPT_URL => $url,
    CURLOPT_RETURNTRANSFER => true,   // Devolver la respuesta en lugar de imprimirla
    CURLOPT_FOLLOWLOCATION => true,   // Seguir redirecciones
    CURLOPT_MAXREDIRS => 5,           // Límite de redirecciones
    CURLOPT_CONNECTTIMEOUT => 5,      // Tiempo de espera para la conexión
    CURLOPT_TIMEOUT => 10,            // Tiempo total de espera
    CURLOPT_NOBODY => true,           // Solicitar solo las cabeceras (HEAD request), es más rápido
    CURLOPT_USERAGENT => 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/109.0.0.0 Safari/537.36', // Simular un navegador
    CURLOPT_SSL_VERIFYPEER => false,  // Ignorar errores de certificado SSL (útil en algunos hostings)
    CURLOPT_SSL_VERIFYHOST => false,
]);

// Ejecutar la solicitud
curl_exec($ch);

// Obtener el código de estado HTTP
$http_code = curl_getinfo($ch, CURLINFO_HTTP_CODE);

// Cerrar la conexión cURL
curl_close($ch);

// Interpretar el resultado
// El indicador más fiable de disponibilidad es un código 404.
// Cualquier otro código (200, 301, 302, 403, 405, etc.) implica que la URL
// existe, está protegida, redirige o la solicitud fue bloqueada.
if ($http_code == 404) {
    echo json_encode(['status' => 'available', 'code' => $http_code]);
} else {
    // No podemos asegurar que esté "tomado", solo que no está "claramente disponible".
    echo json_encode(['status' => 'unavailable_or_blocked', 'code' => $http_code]);
}
?>