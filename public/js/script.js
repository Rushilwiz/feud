let socket = io();

const winner = document.getElementById("winner")
const answers = [...Array(8).keys()].map((i) =>
  document.getElementById("answer" + (i + 1))
);
var setAnswer = (idx, value) => {
  answers[idx - 1].innerHTML = value;
};

const scoreA = document.querySelector("#a>.score");
const scoreB = document.querySelector("#b>.score");
var setScore = (_scoreA, _scoreB) => {
  scoreA.innerHTML = _scoreA;
  scoreB.innerHTML = _scoreB;
};

const yearA = document.querySelector("#a>.year");
const yearB = document.querySelector("#b>.year");

var setYear = (_yearA, _yearB) => {
  yearA.innerHTML = _yearA;
  yearB.innerHTML = _yearB;
};

const current = document.getElementById("current");
var setCurrent = (i) => {
  current.innerHTML = "" + i;
};

const question = document.getElementById("question");
var setQuestion = (i) => {
  question.innerHTML = i;
};

var reset = () => {
  answers.map((answer, i) => {
    setAnswer(i + 1, i + 1);
  });
  winner.style.display = "none"

  setScore(0, 0);
  setYear(2020, 2020);
  setCurrent(0);
  setQuestion("Waiting to continue...");
  for (let i = 1; i < 9; i++)
  setAnswer(i, "");
};

socket.on("reset", () => {
  reset()
})

socket.on("update", (data) => {
  winner.style.display = "none"
  setYear(data["yearA"], data["yearB"])
  setScore(data["scoreA"], data["scoreB"])
  setCurrent(data["current"])
  setQuestion(data["question"])
  for (let i = 1; i < 9; i++)
    setAnswer(i, "");
    
  data["answers"].map((e,i) => {
    setAnswer(i+1, e)
  })
})



socket.on("winner", (data) => {
  winner.style.display = "flex"
  var year
  if (data === "a") year = yearA.innerHTML
  else year = yearB.innerHTML
  winner.innerHTML = year + " wins!"
})