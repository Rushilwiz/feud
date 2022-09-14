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


if (sessionStorage.getItem("data") === null) sessionStorage.setItem("data", JSON.stringify(_default))

document.getElementById("reset").addEventListener("click", () => {
  sessionStorage.setItem("data", JSON.stringify(_default))
  update()
});


var update = () => {
  socket.emit("do-update", JSON.parse(sessionStorage.getItem("data")))
}

var question = 0

let game1 = {
  yearA: 2026,
  yearB: 2024,
  scoreA: 0,
  scoreB: 0,
  current: 0,
  question: "2026 vs 2024: Question 1",
  answers: []
}

let game2 = {
  yearA: 2025,
  yearB: 2023,
  scoreA: 0,
  scoreB: 0,
  current: 0,
  question: "2025 vs 2023: Question 1",
  answers: []
}

let game = [game1, game2]
let currentGame = 0
let currentQuestion = 0

for (let j = 1; j < 3; j++)
  document.getElementById("game"+j).addEventListener("click", () => {
    sessionStorage.setItem("data", JSON.stringify(game[j-1]))
    update()
    console.log("game"+j)
    currentGame = j
  });

class Question {
  constructor(question, answers) {
    this.question = question
    this.answers = answers
  }
}

class Answer {
  constructor(answer, points) {
    this.answer = answer
    this.points = points
  }
}

let QUESTION_STRING = '{"questions":[{"question":"What\'s is first?","answers":[["The plaza",23],["The mall",21]]},{"question":"What\'s is second?","answers":[["The plaza",23],["The mall",21]]},{"question":"What\'s is third?","answers":[["The plaza",23],["The mall",21]]},{"question":"What\'s is first?","answers":[["The plaza",23],["The house",21]]},{"question":"What\'s is second?","answers":[["The plaza",23],["The house",21]]},{"question":"What\'s is third?","answers":[["The plaza",23],["The house",21]]}]}'
let questionData = JSON.parse(QUESTION_STRING)
var questions = []

questionData['questions'].map((q,i) => {
  var question = new Question(q["question"], [])
  q['answers'].map((answer) => {
    question.answers.push(new Answer(answer[0], answer[1]))
  })

  questions.push(question)
})

document.getElementById("startround").addEventListener("click", () => {
  currentQuestion = 0
  loadQuestion()
  update()
})

var loadQuestion = () => {
  data = JSON.parse(sessionStorage.getItem("data"))
  let idx = (currentQuestion) + ((currentGame-1)*3)
  
  console.log("loading question " + idx)
  data["answers"] = Array.from({length: questions[idx].answers.length}, (_, i) => i + 1)
  data["current"] = 0
  data["question"] = questions[idx].question
  sessionStorage.setItem("data", JSON.stringify(data))
  currentQuestion++
}

for (let j = 1; j < 9; j++)
  document.getElementById("show"+j).addEventListener("click", () => {
    showAnswer(j)
    update()
  });

var showAnswer = (j) => {
  data = JSON.parse(sessionStorage.getItem("data"))
  let idx = j + ((currentGame-1)*3)

  var answer = questions[idx].answers[j-1]
  data["current"] += answer.points
  data["answers"][j-1] = answer.answer
  sessionStorage.setItem("data", JSON.stringify(data))
}

document.getElementById("giveA").addEventListener("click", () => {
  givePoints("A")
})


document.getElementById("giveB").addEventListener("click", () => {
  givePoints("B")
})

var givePoints = (i) => {
  data = JSON.parse(sessionStorage.getItem("data"))
  data["score"+i] += data["current"]
  data["current"] = 0
  sessionStorage.setItem("data", JSON.stringify(data))
  update()
}

document.getElementById("nextquestion").addEventListener("click", () => {
  loadQuestion()
  update()
})

document.getElementById("endround").addEventListener("click", () => {
  sendWinner()
})

var sendWinner = () => {
  data = JSON.parse(sessionStorage.getItem("data"))
  var winner
  if (data.scoreA > data.scoreB) winner = "a"
  else winner = "b"

  socket.emit("do-winner", winner)
}