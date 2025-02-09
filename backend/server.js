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
  const existingMenu = await Menu.findOne({ name: { $regex: new RegExp(`^${name}$`, 'i') } });
  if (existingMenu) {
    return res.status(400).json({ error: 'Menu with this name already exists' });
  }
  const menu = new Menu({ name, subMenus });
  await menu.save();
  res.status(201).send(menu);
});

app.get('/api/menus', async (req, res) => {
  const menus = await Menu.find();
  res.send(menus);
});

app.post('/api/menus/:menuId/submenus', async (req, res) => {
  const { menuId } = req.params;
  const { name } = req.body;
  if (!name.trim()) {
    return res.status(400).json({ error: 'Submenu name cannot be empty' });
  }
  try {
    const menu = await Menu.findById(menuId);
    if (!menu) {
      return res.status(404).json({ error: 'Menu not found' });
    }
    if (menu.subMenus.some(sub => sub.name.toLowerCase() === name.toLowerCase())) {
      return res.status(400).json({ error: 'Submenu with this name already exists' });
    }
    menu.subMenus.push({ name });
    await menu.save();
    res.status(200).json(menu);
  } catch (error) {
    res.status(500).json({ error: 'Failed to add submenu' });
  }
});

app.delete('/api/menus/:menuId', async (req, res) => {
  const { menuId } = req.params;
  try {
    const menu = await Menu.findByIdAndDelete(menuId);
    if (!menu) {
      return res.status(404).json({ error: 'Menu not found' });
    }
    res.status(200).json({ message: 'Menu deleted successfully' });
  } catch (error) {
    res.status(500).json({ error: 'Failed to delete menu' });
  }
});

app.delete('/api/menus/:menuId/submenus/:submenuName', async (req, res) => {
  const { menuId, submenuName } = req.params;
  try {
    const menu = await Menu.findById(menuId);
    if (!menu) {
      return res.status(404).json({ error: 'Menu not found' });
    }
    menu.subMenus = menu.subMenus.filter(sub => sub.name.toLowerCase() !== submenuName.toLowerCase());
    await menu.save();
    res.status(200).json(menu);
  } catch (error) {
    res.status(500).json({ error: 'Failed to delete submenu' });
  }
});

app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});