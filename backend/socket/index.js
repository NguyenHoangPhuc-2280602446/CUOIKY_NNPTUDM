let ioInstance;

export const initSocket = (io) => {
  ioInstance = io;
  io.on("connection", (socket) => {
    console.log("socket connected", socket.id);
    socket.on("disconnect", () => console.log("socket disconnected", socket.id));
  });
};

export const emitNewBook = (book) => {
  if (ioInstance) {
    ioInstance.emit("book:new", { message: "Có sách mới nè!", book });
  }
};

export const emitOrderStatus = (order) => {
  if (ioInstance) {
    ioInstance.to(order.user.toString()).emit("order:status", order);
    ioInstance.emit("order:update", order);
  }
};
