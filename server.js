const express = require('express');
const mongoose = require('mongoose');
const bodyParser = require('body-parser');

const app = express();
const port = process.env.PORT || 3000;

// Connect to MongoDB (update the connection string)
mongoose.connect('mongodb://localhost/contactform', {
  useNewUrlParser: true,
  useUnifiedTopology: true
});

// Create a schema for the contact form data
const contactSchema = new mongoose.Schema({
  name: String,
  email: String,
  message: String
});

// Create a model based on the schema
const Contact = mongoose.model('Contact', contactSchema);

// Middleware to parse JSON data
app.use(bodyParser.json());

// Serve static files (e.g., your HTML contact form)
app.use(express.static('public'));

// Handle form submissions
app.post('/contact', async (req, res) => {
  try {
    // Destructuring to simplify code
    const { name, email, message } = req.body;

    // Validate that all required fields are present
    if (!name || !email || !message) {
      return res.status(400).json({ message: 'Missing required fields.' });
    }

    // Create a new contact instance based on the model
    const newContact = new Contact({
      name,
      email,
      message
    });

    // Save the contact form data to the database
    await newContact.save();

    // Send a success response
    res.status(201).json({ message: 'Contact form submitted successfully.' });
    console.log('Contact form submitted:', req.body);

  } catch (error) {
    // Handle errors
    console.error('Error:', error);
    res.status(500).json({ message: 'Internal Server Error' });
  }
});

// Start the server
app.listen(port, () => {
  console.log(`Server is running on port ${port}`);
});
