const express = require('express');
const app = express();
const fs = require('fs');
const path = require('path');


app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(express.static(path.join(__dirname, 'public')));

app.set("view engine", "ejs");


app.get('/', (req, res) => {
    fs.readdir(`./files`, function(err,files)
{
    res.render('index' ,{files:files});
})
});

app.post('/create', (req, res) => {
    const titleWithoutSpaces = req.body.title.split(" ").join(" ");

    const content = `${req.body.details}\n\n\n\n\n\n${req.body.code}`;

    fs.writeFile(`./files/${titleWithoutSpaces}.txt`, content, function(err) {
        if (err) {
            console.error('Error writing file:', err);
            return res.status(500).send('Internal Server Error');
        }
        console.log('File is created successfully.');
        res.redirect('/');
    });
}
);
//we use utf-8 to read the file as a string since it get sent in hex otherwise
app.get('/show/:filename', (req, res) => {
    fs.readFile(`./files/${req.params.filename}`, 'utf8', function(err, data) {
        if (err) {
            console.error('Error reading file:', err);
            return res.status(500).send('Internal Server Error');
        }
        const [code, details] = data.split('\n\n\n\n\n\n');
        const filename= req.params.filename.split("").join("").split(".txt").join("");
        
        res.render('show', { code, details ,filename});
    });
});


app.listen(3000, () => {
    console.log('Server is running on port 3000');
}
);