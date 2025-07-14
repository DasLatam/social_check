# social_check

# Verificador de Nombres Sociales v1.1 🚀

Esta es una sencilla pero potente aplicación web diseñada para ayudar a marcas, negocios y creadores de contenido a encontrar un nombre de usuario consistente en las principales redes sociales.

La herramienta genera automáticamente sugerencias de nombres de usuario a partir de un nombre de marca y luego intenta verificar su disponibilidad en tiempo real.

## Características Principales ✨

* **Generador de Sugerencias:** Introduce un nombre (ej. "Mi Nueva Tienda") y la aplicación creará una lista de nombres de usuario potenciales (`minuevatienda`, `mi_nueva_tienda`, `somosminuevatienda`, etc.).
* **Verificación Automática (Híbrida):** Intenta comprobar la disponibilidad de los nombres en Instagram, TikTok, Facebook y X (Twitter) usando una llamada desde el servidor.
* **Resultados Claros:** Muestra el estado de cada nombre de usuario con un código de color:
    * ✅ **Verde (Disponible):** El nombre probablemente está libre.
    * 🔴 **Rojo (No Disponible / Bloqueado):** El nombre está en uso o la red social bloqueó la verificación.
    * 🟡 **Amarillo (Verificación Manual):** Para redes que no permiten la comprobación automática (como LinkedIn).
* **Diseño Responsivo:** Funciona y se ve bien tanto en computadoras de escritorio como en dispositivos móviles.
* **Ligero y Rápido:** Construido con tecnologías web estándar sin dependencias pesadas.

## Tecnologías Utilizadas 🛠️

* **Frontend:** HTML5, CSS3, JavaScript (ES6+)
* **Backend:** PHP
* **Librerías:** Ninguna, es código puro (Vanilla JS).

## Cómo Funciona

La aplicación utiliza un enfoque híbrido:

1.  **Generación en el Cliente:** El JavaScript del navegador genera las sugerencias de nombres de usuario para una respuesta instantánea.
2.  **Verificación en el Servidor:** Para cada sugerencia, el frontend realiza una llamada `fetch` a un script `checker.php` en el servidor.
3.  **Lógica del Backend:** El script PHP utiliza `cURL` para realizar una solicitud `HEAD` (solo cabeceras, para mayor eficiencia) a la URL del perfil en la red social correspondiente.
    * Si la red social devuelve un código de estado `404 Not Found`, se infiere que el nombre de usuario está **disponible**.
    * Si devuelve cualquier otro código (`200 OK`, `403 Forbidden`, etc.), se asume que el nombre está **ocupado o que la verificación fue bloqueada**.
4.  **Actualización de la Interfaz:** El frontend actualiza los botones con el resultado obtenido, permitiendo siempre al usuario hacer clic para verificar manualmente en una nueva pestaña.

## Instalación ⚙️

Instalar esta aplicación es muy sencillo y solo requiere un hosting compatible con PHP.

1.  Descarga los cuatro archivos del repositorio:
    * `index.html`
    * `style.css`
    * `script.js`
    * `checker.php`
2.  Sube los cuatro archivos a la misma carpeta en tu servidor web (generalmente `public_html` o `www`).
3.  ¡Eso es todo! Visita tu dominio y la aplicación estará funcionando.

## Limitaciones Importantes ⚠️

La verificación automática de nombres de usuario es una tarea compleja porque las redes sociales se protegen activamente contra bots. Ten en cuenta que:

* Un resultado **"No Disponible / Bloqueado"** no garantiza al 100% que el nombre esté en uso. Puede significar que la red social ha detectado y bloqueado temporalmente la solicitud de tu servidor.
* La fiabilidad puede variar con el tiempo si las redes sociales cambian sus métodos de protección.
* La mejor práctica es siempre hacer clic en el botón para **verificar manualmente** el resultado antes de tomar una decisión final.