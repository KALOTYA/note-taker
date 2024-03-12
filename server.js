const express = require('express');
const fs = require('fs');
const path = require('path');
const generateUniqueId = require('./helpers/uuid');

const PORT = 3001;

const app = express();


app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(express.static('public'));

app.get('/notes', (req, res) =>
  res.sendFile(path.join(__dirname, '/public/notes.html'))
);


app.get('/api/notes', (req, res) => {
  fs.readFile(path.join(__dirname, 'db.json'), 'utf8', (err, data) => {
    if (err) {
      console.error('Error reading db.json file: ', err);
      res.status(500).json({ error: 'Internal Server Error' });
      return;
    }

    try {
      const notes = JSON.parse(data);
      res.json(notes);
    } catch (error) {
      console.error('Error pasrsing JSON data: ', error);
      res.status(500).json({ error: 'Tnternal Server Error' });
    }
  });
});


app.post('api/notes', (req, res) => {
  console.info('POST request recieved to add a new note');

  const { title, text } = req.body;
  
  if (!title || !text) {
    res.status(400).json({ error: 'Title and text are required fields' });
    return;
  }
  fs.readFile(path.join(__dirname, 'db.json'), 'utf8', (err, data) => {
    if (err) {
      console.error('Error reading db.json file: ', err);
      res.status(500).json({ error: 'Internal Server Error' });
      return;
    }

    try {
      const notes = JSON.parse(data);
      const newNote = {
        id: ,
        title,
        text
      };

      notes.push(newNote);


    }

    
  })
})


app.get('*', (req, res) => 
    res.sendFile(path.join(__dirname, '/public/index.html'))
);




app.listen(PORT, () =>
  console.log(`App listening at http://localhost:${PORT}`)
);