const express = require('express');
const mongoose = require('mongoose');
const app = express();
const bodyParser = require('body-parser');
const cors = require('cors')
// Load environment variables
require('dotenv').config();
const PORT = process.env.PORT || 3300;
const authRoutes = require('./routes/authRoutes');
const userRoutes = require('./routes/userRoutes');
const quizRoutes = require('./routes/quizRoutes');

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
app.use(cors())

// register a route
app.use('/api', authRoutes);
app.use('/api', userRoutes)
app.use('/api/quiz', quizRoutes)

app.listen(PORT, function(){
    console.log(`Server running at ${PORT}`);
})