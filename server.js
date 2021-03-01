const fs = require('fs');
const path = require('path');
const express = require('express');
let notesArr = fs.readFileSync("./db/db.json", "utf8");

const PORT = process.env.PORT || 3001;
const app = express();

// parse incoming string or array data
app.use(express.urlencoded({ extended: true }));
// parse incoming JSON data
app.use(express.json());

app.use(express.static('public'));


// HTML routes
app.get('/', (req, res) => {
    res.sendFile(path.join(__dirname, './public/index.html'));
  });

app.get('/notes', (req, res) => {
    res.sendFile(path.join(__dirname, './public/notes.html'));
  });
  
// API Routes

app.get('/api/notes', (req, res) => {
  const notes = JSON.parse(fs.readFileSync('./db/db.json', 'utf8'));
  res.json(notes);
})

//  post new notes

app.post("/api/notes", (req, res) => {
  const newNote = req.body;
  newNote.id = notesArr.length + "-" + Math.floor(Math.random() * 1000000);

  notesArr = JSON.parse(notesArr);
  notesArr.push(newNote);

  fs.writeFileSync(
      path.join(__dirname, "./db/db.json"),
      JSON.stringify(notesArr, null, 2)
  );

  // delete notes 

  app.delete("/api/notes/:id", (req, res) => {
    notesArr = JSON.parse(notesArr);
    const updateNotesArr = notesArr.filter((deletedNote) => deletedNote.id !== req.params.id);

    fs.writeFileSync("./db/db.json", JSON.stringify(updateNotesArr));

    res.json(updateNotesArr);
});

  res.json(notesArr);
});



app.listen(PORT, () => {
    console.log(`API server now on port ${PORT}`);
});