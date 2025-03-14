const express = require('express');
const cors = require('cors');
const mongoose = require("mongoose");
const User = require("./models/User");
const Message = require("./models/Message");
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const SECRET_KEY = 'a6f3b2797b0d99c1c6356e7ac1f18201dfe7193b8fbdad6a5c8f0b4f738e67db';

mongoose.connect("mongodb://localhost:27017/ChatApp", { useNewUrlParser: true, useUnifiedTopology: true });
const db = mongoose.connection;
db.on("error", console.error.bind(console, "connection error:"));
db.once("open", function() {
  console.log("Connected to MongoDB");
});

const app = express();
app.use(cors());
const port = 3000;
app.listen(port, () => {
    console.log(`Server running at http://localhost:${port}`);
    }
);
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

app.post('/api/login', async (req, res) => {
  const { email, password } = req.body;

  try {
    // Find user in database
    const user = await User.findOne({ email });
    if (!user) return res.status(401).json({ message: "User not found" });

    // Compare passwords
    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) return res.status(401).json({ message: "Invalid credentials" });

    // Generate JWT token
    const token = jwt.sign({ id: user._id, email: user.email }, SECRET_KEY, { expiresIn: "3s" });

    res.json({ token, user: { id: user._id, email: user.email } });
  } catch (error) {
    res.status(500).json({ message: "Server error" });
  }
});

app.post('/api/signup', async (req, res) => {
  const { firstName, lastName, email, password} = req.body;

  const newUser = new User({ firstName, lastName, email, password});
  try {
    await newUser.save();
    console.log('User information: ', req.body);
    res.status(200).send(newUser);
  } catch (err) {
    console.log(err);
    res.status(500).send('Error creating user');
  }

});
app.get('/api/user', async (req, res) => {
  const { email, token } = req.query;
  const user = await User.findOne({ email });
  if (!user) return res.status(401).json({ message: "User not found" });
  res.json({ user: { id: user._id, email: user.email } });


});

app.post('/api/message', async (req, res) => {
  const { sender, receiver, content } = req.body;
  console.log(req.body);
  const newMessage = new Message({ sender, receiver, content });
  try {
    await newMessage.save();
    res.status(200).send(newMessage);
  }
  catch (err) {
    console.log(err);
    res.status(500).send('Error sending message');
  }

});

app.get('/api/message', async (req, res) => {
  const { sender, receiver } = req.query;
  try {
    const messages = await Message.find({ $or: [{ sender, receiver }, { sender: receiver, receiver: sender }] });
    // Send the fetched messages as a JSON response to the client
    res.json(messages);
    // res.status(200).send(messages);
    console.log(messages);
  }
  catch (err) {
    console.log(err);
    res.status(500).send('Error fetching messages');
  }
});

app.delete('/api/message', (req, res) => {
  res.send('Message deleted');
});
app.put('/api/user', (req, res) => {
  res.send('User updated');
});
app.post('/api/verifyToken', (req, res) => {
  // const { token } = req.headers.authorization

})
app.delete('/api/user', (req, res) => {
  res.send('User deleted');
});
app.get('/api/users', async (req, res) => {
  try {
    const token = req.headers.authorization && req.headers.authorization.split(' ')[1];
    console.log(token);
    if (!token) return res.status(401).json({ message: "Token not found" });
    // try {
    //   const decoded = jwt.verify(token, SECRET_KEY);
    //   req.userId = decoded.id;
    // } catch (error) {
    //   console.error(error);
    //   return res.status(401).json({ message: "Token is invalid" });
    // }
    const users = await User.find({}, 'firstName lastName email'); // Select only needed field
    console.log('Get all users');
    res.json(users); // Send JSON response directlys
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Server error' });
  }
});
app.post('/api/logout', (req, res) => {
  res.send('User logged out');
});
app.get('/api/protected', (req, res) => {
  res.send('Protected route');
});
app.get('/api/unprotected', (req, res) => {
  res.send('Unprotected route');
});

