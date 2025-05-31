// /backend/src/socket/whiteboard.js

module.exports = (io) => {
  // Un objeto en memoria por sala: { [roomName]: { lines: [], texts: [] } }
  const whiteboards = {};

  io.on("connection", (socket) => {
    let currentRoom = null;

    // Al unirse a una sala
    socket.on("join-whiteboard", (room) => {
      currentRoom = room;
      socket.join(room);
      // Enviar el estado actual al usuario que entra
      if (whiteboards[room]) {
        socket.emit("whiteboard-state", whiteboards[room]);
      } else {
        whiteboards[room] = { lines: [], texts: [] };
        socket.emit("whiteboard-state", { lines: [], texts: [] });
      }
    });

    // Alguien dibuja
    socket.on("draw-line", (data) => {
      if (!currentRoom) return;
      whiteboards[currentRoom].lines.push(data);
      socket.to(currentRoom).emit("draw-line", data);
    });

    // Alguien agrega texto
    socket.on("add-text", (data) => {
      if (!currentRoom) return;
      whiteboards[currentRoom].texts.push(data);
      socket.to(currentRoom).emit("add-text", data);
    });

    // Limpiar tablero
    socket.on("clear-whiteboard", () => {
      if (!currentRoom) return;
      whiteboards[currentRoom] = { lines: [], texts: [] };
      io.to(currentRoom).emit("whiteboard-state", whiteboards[currentRoom]);
    });

    socket.on("disconnect", () => {
      currentRoom = null;
    });
  });
};
