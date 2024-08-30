const express = require('express');
const bodyParser = require('body-parser');
const app = express();
const PORT = process.env.PORT || 3000;
const multer = require('multer');
const path = require('path');

app.use('/uploads', express.static('uploads'));


io.on('connection', (socket) => {
    console.log('A user connected');
  
    // Handle content updates
    socket.on('contentUpdate', (content) => {
      console.log('Content received:', content);
      socket.broadcast.emit('updateContent', content);
    });
  
    // Handle file upload notifications
    socket.on('fileUpload', (file) => {
      console.log('File upload:', file);
      socket.broadcast.emit('notifyFileUpload', file);
    });
  
    // Handle disconnection
    socket.on('disconnect', () => {
      console.log('A user disconnected');
    });
  });
  

// Configure multer
const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, 'public/uploads/');
  },
  filename: (req, file, cb) => {
    cb(null, Date.now() + path.extname(file.originalname));
  }
});

const upload = multer({ storage: storage });

// Route to handle file uploads
app.post('/upload', upload.single('file'), (req, res) => {
  res.send('File uploaded successfully!');
});


// Middleware to serve static files
app.use(express.static('public'));

// Middleware to parse JSON data
app.use(bodyParser.json());

// Basic route
app.get('/', (req, res) => {
  res.sendFile(__dirname + '/public/index.html');
});

// Route to save editor content
app.post('/save', (req, res) => {
  const editorContent = req.body.content;
  console.log('Received content:', editorContent);
  // Here, you can save the content to a database or file system
  res.status(200).send('Content saved successfully!');
});

// Route to delete a file
app.delete('/delete/:fileName', (req, res) => {
    const fileName = req.params.fileName;
    const filePath = `uploads/${fileName}`;
  
    fs.unlink(filePath, (err) => {
      if (err) {
        return res.status(500).send('Error deleting file');
      }
      io.emit('notifyFileDeletion', fileName); // Notify other users
      res.send('File deleted successfully!');
    });
  });

// Start the server
app.listen(PORT, () => {
  console.log(`Server is running on http://localhost:${PORT}`);
});


