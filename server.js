const express = require('express');
const fs = require('fs');
const path = require('path');
const generateUniqueId = require('./helper/uuid');

const PORT = process.env.PORT || 3001;

const app = express();


app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(express.static('public'));

app.get('/', (req, res) =>
  res.sendFile(path.join(__dirname, '/public/index.html'))
);

app.get('/notes', (req, res) =>
  res.sendFile(path.join(__dirname, '/public/notes.html'))
);


app.get('/api/notes', (req, res) => {
  fs.readFile(path.join(__dirname, '/db/db.json'), 'utf8', (err, data) => {
    if (err) {
      console.error('Error reading db.json file: ', err);
      return res.status(500).json({ error: 'Internal Server Error' });
    }
    res.json(JSON.parse(data));
  });
});


app.post('/api/notes', (req, res) => {
  console.info('POST request received to add a new note');

  const { title, text } = req.body;
  if (!title || !text) {
    return res.status(400).json({ error: 'Title and text are required fields' });
  }

  fs.readFile(path.join(__dirname, '/db/db.json'), 'utf8', (err, data) => {
    if (err) {
      console.error('Error reading db.json file: ', err);
      return res.status(500).json({ error: 'Internal Server Error' });
    }

    const notes = JSON.parse(data);
    const newNote = {
      id: generateUniqueId(),
      title,
      text
    };

    notes.push(newNote);

    fs.writeFile(path.join(__dirname, '/db/db.json'), JSON.stringify(notes), (err) => {
      if (err) {
        console.error('Error writing to db.json file: ', err);
        return res.status(500).json({ error: 'Internal Server Error' });
      }
      console.log('New note added: ', newNote);
      res.status(201).json(newNote);
    });
  });
})


app.get('*', (req, res) => 
    res.sendFile(path.join(__dirname, '/public/index.html'))
);




app.listen(PORT, () =>
  console.log(`App listening at http://localhost:${PORT}`)
);