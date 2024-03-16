const express = require('express');
const mongoose = require('mongoose');
const app = express();
const bodyParser = require('body-parser');
const http = require('http');
const socketIO = require('socket.io');
const cors = require('cors');

const server = http.createServer(app);
const io = socketIO(server, {
  cors: {
    origin: 'http://localhost:4400',
    methods: ['GET', 'POST'],
  },
});

// Load environment variables
require('dotenv').config();
const PORT = process.env.PORT || 3300;
const authRoutes = require('./routes/authRoutes');
const userRoutes = require('./routes/userRoutes');
const quizRoutes = require('./routes/quizRoutes');
const Message = require('./models/message');
const { sendMessageOnSocket } = require('./controllers/userController');

// Connect to MongoDB
mongoose.connect(process.env.MONGODB_URI, {
    useNewUrlParser: true,
    useUnifiedTopology: true,
})
const db = mongoose.connection;
db.on('error', console.error.bind(console, 'MongoDB connection error:'));
db.once('open', () => {
  console.log('Connected to MongoDB');
});

app.use('/upload', express.static('upload'));
app.use(express.json());
// OR app.use(bodyParser.json())
const corsOptions = {
  origin: 'http://localhost:4400', // Replace with your Angular app's URL
  optionsSuccessStatus: 200,
};
app.use(cors(corsOptions));

// register a route
app.use('/api', authRoutes);
app.use('/api', userRoutes)
app.use('/api/quiz', quizRoutes)

// socket code
io.on('connection', (socket) => {
  console.log('A user connected');
  // Listen for chat messages
  socket.on('chatMessage', (message) => {
    try {
      sendMessageOnSocket({ 
       sender : message.senderId,
       receiver : message.receiverId,
       message : message.message
      })
      io.emit('chatMessage', { 
        sender : message.senderId,
        receiver : message.receiverId,
        message : message.message,
        timestamp: new Date()
       });
    } catch (error) {
      io.emit('error', { message: 'Error saving message to the database' });
    }
  });

  // Handle disconnect
  socket.on('disconnect', () => {
    console.log('User disconnected');
  });
});

server.listen(PORT, function(){
    console.log(`Server running at ${PORT}`);
})