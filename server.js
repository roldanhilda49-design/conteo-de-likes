const express = require('express');
const http = require('http');
const { Server } = require('socket.io');
const cors = require('cors');

const app = express();
const server = http.createServer(app);

// CORS: permitir desde localhost y 127.0.0.1 (Live Server)
app.use(cors({
  origin: ["http://localhost:5500", "http://127.0.0.1:5500"],
  methods: ["GET", "POST"]
}));
app.use(express.json());

const PORT = process.env.PORT || 3000;
let likes = 0;

// Rutas REST
app.get('/', (req, res) => res.json({ likes }));

app.post('/like', (req, res) => {
  likes += 1;
  io.emit('likeUpdated', likes); // Notificar a todos los clientes
  res.json({ likes });
});

// Configurar Socket.IO con CORS compatible
const io = new Server(server, {
  cors: {
    origin: ["http://localhost:5500", "http://127.0.0.1:5500"],
    methods: ["GET", "POST"]
  }
});

io.on('connection', (socket) => {
  console.log('Nuevo cliente conectado:', socket.id);
  socket.emit('likeUpdated', likes);

  socket.on('disconnect', () => {
    console.log('Cliente desconectado:', socket.id);
  });
});

// Iniciar servidor
server.listen(PORT, () => console.log(`Servidor escuchando en puerto ${PORT}`));
