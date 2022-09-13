let socket = io();

const _default = {
  yearA: 2022,
  yearB: 2022,
  scoreA: 0,
  scoreB: 0,
  current: 0,
  question: "Waiting to continue...",
  answers: [],
};


if (sessionStorage.getItem("data") === null) sessionStorage.setItem("data", JSON.stringify(data))
else data = sessionStorage.getItem("data")

document.getElementById("reset").addEventListener("click", () => {
  sessionStorage.setItem("data", JSON.stringify(_default))
  update()
});


var update = () => {
  socket.emit("do-update", JSON.parse(sessionStorage.getItem("data")))
}