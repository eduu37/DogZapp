let io;

export function initSocket(serverIo) {
  io = serverIo;
  io.on("connection", (socket) => {
    console.log("Socket conectado:", socket.id);

    socket.on("joinCommunity", ({ comunidadId }) => {
      if (comunidadId) {
        socket.join(`comunidad:${comunidadId}`);
        console.log(`Socket ${socket.id} se unió a comunidad:${comunidadId}`);
      }
    });

    socket.on("leaveCommunity", ({ comunidadId }) => {
      socket.leave(`comunidad:${comunidadId}`);
    });

    socket.on("disconnect", () => console.log("Socket desconectado:", socket.id));
  });
}

export function emitToCommunity(comunidadId, event, payload) {
  if (!io) return;
  io.to(`comunidad:${comunidadId}`).emit(event, payload);
}
