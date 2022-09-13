const express = require('express');
const app = express();
const http = require('http');
const server = http.createServer(app);
const { Server } = require("socket.io");
const io = new Server(server);

app.get('/', (req, res) => {
  res.sendFile(__dirname + '/index.html');
});

app.get('/admin', (req, res) => {
  const reject = () => {
    res.setHeader("www-authenticate", "Basic")
    res.sendStatus(401)
  }

  const authorization = req.headers.authorization
  if (!authorization) return reject();

  const [username, password] = Buffer.from(
    authorization.replace("Basic ", ""),
    "base64".toString().split(":")
  )

  if (!(username === "olympics") && password === "I<3FamilyFeud!")
    return reject();
  
  res.sendFile(__dirname + "/admin.html");
})

app.use(express.static("public"))

io.on('connection', (socket) => {
  socket.on("do-reset", () => {
    console.log("reset")
    io.emit("reset")
  })
});


server.listen(3000, () => {
  console.log('listening on *:3000');
});
