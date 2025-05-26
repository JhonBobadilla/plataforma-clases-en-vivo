Plataforma de Clases en Vivo

1. Descripción General

La plataforma permite clases o reuniones en vivo donde profesores u organizadores y alumnos o interlocutores interactúan en tiempo real mediante video, audio, chat, pizarra virtual y compartido de pantalla. La solución es robusta, segura, escalable y 100% responsive. Se aplicó Clean Architecture y principios SOLID para un sistema desacoplado y fácil de mantener.

Profesor u organizador es el mismo rol segun el caso que sea clase o reunión.
Alumno o interlocutor o asistentes es el mismo rol segun el caso que sea clase o reunión.  

2. Roles y Permisos

Profesor u organizador:

Registro, login, recuperación de contraseña.
Puede tener varias clases o reuniones en diferentes horarios.
Ingreso a la clase io reunión asignada desde su panel.
Controles avanzados:
Silenciar micrófonos y apagar cámaras de alumnos o interlocutores.
Permitir/denegar a alumnos o interlocutores el uso de micrófono y cámara.
Permitir o restringir acceso al tablero para los alumnos o intrerlocutores.
Expulsar (sacar) a alumnos o asistentes de la clase o reunión.
Compartir su pantalla (incluyendo audio).
Grabar la clase o reunión (solo el profesor u organizador).
Al ingresar a la clase o reunión:
Su cámara aparece en la parte superior izquierda.
Puede escribir en el tablero virtual (libre con cursor o teclado, borrar selectivo o total).

Alumno o interlocutor:

Registro, login, recuperación de contraseña.
Visualiza e ingresa a sus clases o reuniones inscritas (varias posibles).

Ingreso con un clic, sin autorización previa del docente u organizador.

Puede:

Activar/desactivar su cámara/micrófono (si el profesor o organizador lo permite).
Compartir su pantalla (incluyendo audio).
Levantar la mano para participar (sistema de turnos, orden de llegada).
Escribir en el tablero solo si el profesor u organizador da permiso.
Participar en el chat global.
Cuando habla un alumno o interlocutor (o es su turno de participación), su video ocupa la posición principal en la parte superior, reemplazando la del profesor u organizador.

Restricciones:

No puede silenciar, apagar cámara, ni expulsar a otros.
No puede grabar la clase.

3. Interfaz de Usuario

Parte superior (mitad de pantalla):

Izquierda: Ventana de video principal (profesor u organizador o alumno o interlocutor activo).
Derecha: Tablero virtual (escritura libre y teclado).

Parte inferior:

Galería de ventanas de video/audio de alumnos o interlocutores (miniaturas).
Chat en tiempo real, visible para todos.

Encabezado:

Título de la clase.

Responsive:

Adaptado para móvil, tablet y escritorio.

4. Funcionalidades Principales

Gestión de usuarios (profesor-organizador/alumno-interlocutor) y clases
Videollamada grupal (WebRTC/SFU)
Tablero virtual colaborativo
Control de permisos en tiempo real
Chat general en tiempo real
Grabación de la sesión (profesor u organizador)
Compartición de pantalla (profesor-organizador y alumno-interlocutor)
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
Escalabilidad: diseño para soportar múltiples clases y salas simultáneas.

6. Reglas de Negocio Clave

El profesor u organizador tiene control total sobre la clase, los permisos y el tablero.
Los alumnos o interlocutores pueden participar y compartir pantalla solo si el profesor u organizador lo permite.
Solo el profesor u organizador puede grabar la clase y expulsar participantes.
La interacción en el tablero puede ser restringida por el profesor u organizador.
La plataforma funciona en móvil, tablet y escritorio.

7. MVP (mínimo producto viable)

Registro, login y recuperación de contraseña (ambos roles).
Listado de clases o reuniones por usuario.
Videollamada básica (WebRTC) con chat.
Tablero virtual solo editable (se pone o quita) solo por el profesor u organizador.
Sistema de permisos básicos (activar/desactivar cámara/micrófono).
Expulsar participantes y grabar clase.
Responsive básico.
