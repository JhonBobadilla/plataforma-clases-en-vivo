1. Descripción General

La plataforma permite clase/reunión en vivo donde profesor/organizador y alumno/asistente interactúan en tiempo real mediante video, audio, chat, pizarra virtual y compartido de pantalla. La solución es robusta, segura, escalable y 100% responsive. Se aplicó Clean Architecture y principios SOLID para un sistema desacoplado y fácil de mantener.

- Profesor/organizador es el mismo rol segun el caso que sea clase/reunión.
- Alumno/asistente es el mismo rol segun el caso que sea clase/reunión o reunión.  

2. Roles y Permisos

Profesor/organizador:

Registro, login, recuperación de contraseña.
Puede tener varias clases/reuniones en diferentes horarios.
Ingreso a la clase/reunión asignada desde su panel.
Controles avanzados:
Silenciar micrófonos y apagar cámaras de alumno/asistente.
Permitir/denegar a alumno/asistente el uso de micrófono y cámara.
Permitir o restringir acceso al tablero para los alumnos/asistentes.
Expulsar (sacar) a alumno/asistente de la clase/reunión.
Compartir su pantalla (incluyendo audio).
Grabar la clase/reunión (solo el profesor/organizador).
Al ingresar a la clase/reunión:
Su cámara aparece en la parte superior izquierda.
Puede escribir en el tablero virtual (libre con cursor o teclado, borrar selectivo o total).

Alumno/asistente:

Registro, login, recuperación de contraseña.
Visualiza e ingresa a su clase/reunión inscrita (varias posibles).

Ingreso con un clic, sin autorización previa del docente/organizador.

Puede:

Activar/desactivar su cámara/micrófono (si el profesor/organizador lo permite).
Compartir su pantalla (incluyendo audio).
Levantar la mano para participar (sistema de turnos, orden de llegada).
Escribir en el tablero solo si el profesor/organizador da permiso.
Participar en el chat global.
Cuando habla un alumno/asistente (o es su turno de participación), su video ocupa la posición principal en la parte superior, reemplazando la del profesor/organizador.

Restricciones:

No puede silenciar, apagar cámara, ni expulsar a otros.
No puede grabar la clase/reunión.

3. Interfaz de Usuario

Parte superior (mitad de pantalla):

Izquierda: Ventana de video principal (profesor/organizador o alumno/asistente este hablando).
Derecha: Tablero virtual (escritura libre y teclado).

Parte inferior:

Galería de ventanas de video/audio de alumnos/asistentes (miniaturas).
Chat en tiempo real, visible para todos.

Encabezado:

Título de la clase/reunión.

Responsive:

Adaptado para móvil, tablet y escritorio.

4. Funcionalidades Principales

Gestión de usuarios (profesor/organizador alumno/asistente) y clase/reunión
Videollamada grupal (WebRTC/SFU)
Tablero virtual colaborativo
Control de permisos en tiempo real
Chat general en tiempo real
Grabación de la sesión (profesor/organizador u organizador)
Compartición de pantalla (profesor/organizador y alumno/asistente)
Sistema de turnos para levantar la mano
Recuperación de contraseña
Diseño responsive y accesible
Arquitectura desacoplada (Clean Architecture + SOLID)

5. Consideraciones Técnicas y Arquitectura

Frontend

React.js + Tailwind CSS.
Estado avanzado (Redux, Zustand).
Integración de WebRTC para videollamada y screen sharing.
Socket.io para eventos en tiempo real y chat.
Konva.js/Fabric.js para el tablero virtual.

Backend

Node.js + Express.js.
Autenticación con JWT.
WebSockets (Socket.io) para control en tiempo real.
Base de datos relacional (PostgreSQL).
Sistema de archivos/almacenamiento en la nube para grabaciones.

Arquitectura

Clean Architecture: separación por capas (Presentación, Dominio, Aplicación, Infraestructura).
Principios SOLID en toda la lógica de negocio.
Control exhaustivo de roles y permisos en el backend.

Otros

Grabación: MediaRecorder API en navegador para descarga local o subida a un onedrive.
Recuperación de contraseña por email seguro.
Escalabilidad: diseño para soportar múltiples clases/reuniones y salas simultáneas.

6. Reglas de Negocio Clave

El profesor/organizador tiene control total sobre la clase/reunión, los permisos y el tablero.
Los alumnos/asistentes pueden participar y compartir pantalla solo si el profesor/organizador lo permite.
Solo el profesor/organizador puede grabar la clase/reunión y expulsar participantes.
La interacción en el tablero puede ser restringida por el profesor/organizador.
La plataforma funciona en móvil, tablet y escritorio.

7. MVP (mínimo producto viable)

Registro, login y recuperación de contraseña (ambos roles).
Listado de clases/reuniones por usuario.
Videollamada básica (WebRTC) con chat.
Tablero virtual solo editable (se pone o quita) solo por el profesor/organizador.
Sistema de permisos básicos (activar/desactivar cámara/micrófono).
Expulsar participantes y grabar clase/reunión.
Responsive básico.
