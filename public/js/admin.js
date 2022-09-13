let socket = io();

document.getElementById("reset").addEventListener("click", () => {
  socket.emit("do-reset")
})