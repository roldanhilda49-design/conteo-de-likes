const express = require('express');
const http = require('http');
const { Server } = require('socket.io');
const cors = require('cors');

const app = express();
const server = http.createServer(app);
const PORT = process.env.PORT || 3000;

app.use(cors());
app.use(express.json());

let likes = 0;

// Rutas REST
app.get('/like-count', (req, res) => res.json({ likes }));
app.post('/like', (req, res) => {
  likes += 1;
  io.emit('likeUpdated', likes);
  res.json({ likes });
});

// Socket.IO con CORS
const io = new Server(server, { cors: { origin: "*", methods: ["GET","POST"] } });

io.on('connection', (socket) => {
  console.log('Cliente conectado:', socket.id);
  socket.emit('likeUpdated', likes);
  socket.on('disconnect', () => console.log('Cliente desconectado:', socket.id));
});

server.listen(PORT, () => console.log(`Servidor escuchando en puerto ${PORT}`));
