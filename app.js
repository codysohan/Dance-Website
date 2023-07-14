const express = require("express");
const path = require("path");
const app = express();
const port = 80;
const mongoose = require('mongoose');

// Define the schema for the data
const contactSchema = new mongoose.Schema({
  name: String,
  email: String,
  phone: Number,
  class: Number
});

// Compile the schema into a model named 'Contact'
const Contact = mongoose.model('Contact', contactSchema);

// Define the main function as an async function
async function main() {
  // Establish a connection to the MongoDB server
  await mongoose.connect('mongodb://127.0.0.1:27017/contact-data');
}

// Call the main function to establish the database connection
main().catch((error) => {
  console.error('Error connecting to the database:', error);
});

// EXPRESS SPECIFIC STUFF
app.use('/static', express.static('static')) // For serving static files
app.use(express.urlencoded()); // For taking data of forms inputs

app.set('view engine', 'pug') // Set the template engine as pug
app.set('views', path.join(__dirname, 'views')) // Set the views directory

// ENDPOINTS
app.get('/', (req, res) => {
  res.status(200).render('home.pug');
});

app.get('/contact', (req, res) => {
  res.status(200).render('contact.pug');
});

app.post('/contact', (req, res) => {
  var myData = new Contact(req.body);
  myData.save()
    .then(() => {
      res.render('contact-submit.pug');
    })
    .catch(() => {
      res.status(400).send('Item was not saved to the database');
    });
});

// START THE SERVER
app.listen(port, () => {
  console.log(`The application started successfully on port ${port}`);
});
