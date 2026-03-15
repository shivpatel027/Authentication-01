const express = require('express');
const app = express();

app.use(express.json());

const DIARY = {
    
};

const EMAIL = new Set();

app.get('/', (req, res) => {
  res.send('Hello, World!');
});


app.post('/signup', (req, res) => {
    // Handle signup logic here
  const { name, email, password } = req.body;
  if(EMAIL.has(email)) {
    return res.status(400).json({ message: 'Email already exists' });
  }

  const token = Date.now() + Math.random().toString(36).substring(2);
  DIARY[token] = {name, email, password};
  EMAIL.add(email);

  return res.status(201).json({ message: 'User registered successfully', token });
});

app.post('/me', (req, res) => {
    const { token } = req.body;
    if(!token) {
        return res.status(400).json({ message: 'Token is required' });
    }

    if(!(token in DIARY)){
        return res.status(401).json({ message: 'Invalid token' });
    }

    const entry = DIARY[token];

    return res.status(200).json({ message: 'User details retrieved successfully', entry });
});

app.post('/private-data', (req, res) => {
    const { token } = req.body;
    if(!token) {
        return res.status(400).json({ message: 'Token is required' });
    }

    if(!(token in DIARY)){
        return res.status(401).json({ message: 'Invalid token' });
    }
    const entry = DIARY[token];

    return res.status(200).json({ message: 'Private data retrieved successfully', data: `This is private data for ${entry.name}` });
});

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});