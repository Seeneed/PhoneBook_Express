const express = require('express');
const exphbs = require('express-handlebars');
const fs = require('fs/promises');
const path = require('path');

const app = express();
const PORT = process.env.PORT || 3000;
const dataFile = path.join(__dirname, 'contacts.json');

const hbs = exphbs.create({
    extname: '.hbs',
    defaultLayout: 'main',
    helpers: {
        cancelBtn: () => {
            return new hbs.handlebars.SafeString('<a href="/" class="btn cancel">Отказаться</a>');
        }
    }
});

app.engine('.hbs', hbs.engine);
app.set('view engine', '.hbs');

app.use(express.static(path.join(__dirname, 'public')));
app.use(express.urlencoded({ extended: true }));

async function getContacts() {
    const data = await fs.readFile(dataFile, 'utf-8');
    return JSON.parse(data);
}

async function saveContacts(contacts) {
    await fs.writeFile(dataFile, JSON.stringify(contacts, null, 2));
}

app.get('/', async (req, res) => {
    const contacts = await getContacts();
    res.render('index', { contacts, disabled: false });
});

app.get('/Add', async (req, res) => {
    const contacts = await getContacts();
    res.render('add', { contacts, disabled: true }); 
});

app.get('/Update', async (req, res) => {
    const id = req.query.id;
    const contacts = await getContacts();
    const contactToUpdate = contacts.find(c => c.id === id);
    res.render('update', { contacts, disabled: true, contact: contactToUpdate });
});

app.post('/Add', async (req, res) => {
    const { name, phone } = req.body;
    const contacts = await getContacts();
    const newId = Date.now().toString();
    contacts.push({ id: newId, name, phone });
    await saveContacts(contacts);
    res.redirect('/');
});

app.post('/Update', async (req, res) => {
    const { id, name, phone } = req.body;
    let contacts = await getContacts();
    const index = contacts.findIndex(c => c.id === id);
    if (index !== -1) {
        contacts[index] = { id, name, phone };
        await saveContacts(contacts);
    }
    res.redirect('/');
});

app.post('/Delete', async (req, res) => {
    const { id } = req.body;
    let contacts = await getContacts();
    contacts = contacts.filter(c => c.id !== id);
    await saveContacts(contacts);
    res.redirect('/');
});

app.listen(PORT, () => {
    console.log(`Сервер запущен: http://localhost:${PORT}`);
});