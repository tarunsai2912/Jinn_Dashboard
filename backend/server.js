const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
const bodyParser = require('body-parser');

const app = express();
const PORT = process.env.PORT || 5000;
const dotenv = require('dotenv');

dotenv.config();

app.use(cors());
app.use(bodyParser.json());

mongoose.connect(process.env.MONGO_URI);

mongoose.connection.on('connected', () => {
    console.log('MongoDB is connected...');
});

const menuSchema = new mongoose.Schema({
  name: String,
  subMenus: [{ name: String }],
});

const Menu = mongoose.model('Menu', menuSchema);

app.get('/', (req, res) => {
    res.send('Welcome to Jinn');
});

app.post('/api/menus', async (req, res) => {
  const { name, subMenus } = req.body;
  const menu = new Menu({ name, subMenus });
  await menu.save();
  res.status(201).send(menu);
});

app.get('/api/menus', async (req, res) => {
  const menus = await Menu.find();
  res.send(menus);
});

app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});