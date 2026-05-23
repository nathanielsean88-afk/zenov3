const express = require('express');
const path = require('path');
const fs = require('fs');

const app = express();
const PORT = process.env.PORT || 3000;

app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(express.static(path.join(__dirname, 'public')));

// File-based storage
const USERS_FILE = path.join(__dirname, 'users.json');
const ORDERS_FILE = path.join(__dirname, 'orders.json');

if (!fs.existsSync(USERS_FILE)) fs.writeFileSync(USERS_FILE, JSON.stringify([]));
if (!fs.existsSync(ORDERS_FILE)) fs.writeFileSync(ORDERS_FILE, JSON.stringify([]));

function getUsers() { return JSON.parse(fs.readFileSync(USERS_FILE, 'utf8')); }
function saveUsers(u) { fs.writeFileSync(USERS_FILE, JSON.stringify(u, null, 2)); }
function getOrders() { return JSON.parse(fs.readFileSync(ORDERS_FILE, 'utf8')); }
function saveOrders(o) { fs.writeFileSync(ORDERS_FILE, JSON.stringify(o, null, 2)); }

// Pages
app.get('/', (req, res) => res.sendFile(path.join(__dirname, 'public', 'index.html')));
app.get('/login', (req, res) => res.sendFile(path.join(__dirname, 'public', 'login.html')));
app.get('/register', (req, res) => res.sendFile(path.join(__dirname, 'public', 'register.html')));
app.get('/dashboard', (req, res) => res.sendFile(path.join(__dirname, 'public', 'dashboard.html')));
app.get('/products', (req, res) => res.sendFile(path.join(__dirname, 'public', 'products.html')));
app.get('/checkout', (req, res) => res.sendFile(path.join(__dirname, 'public', 'checkout.html')));
app.get('/orders', (req, res) => res.sendFile(path.join(__dirname, 'public', 'orders.html')));

// API Register
app.post('/api/register', (req, res) => {
    const { username, email, password } = req.body;
    if (!username || !email || !password)
        return res.json({ success: false, message: 'Semua field harus diisi!' });
    const users = getUsers();
    if (users.find(u => u.email === email))
        return res.json({ success: false, message: 'Email sudah terdaftar!' });
    users.push({ id: Date.now(), username, email, password, createdAt: new Date().toISOString() });
    saveUsers(users);
    res.json({ success: true, message: 'Registrasi berhasil! Silakan login.' });
});

// API Login
app.post('/api/login', (req, res) => {
    const { email, password } = req.body;
    if (!email || !password)
        return res.json({ success: false, message: 'Email dan password harus diisi!' });
    const users = getUsers();
    const user = users.find(u => u.email === email && u.password === password);
    if (!user) return res.json({ success: false, message: 'Email atau password salah!' });
    res.json({ success: true, message: 'Login berhasil!', username: user.username, userId: user.id, email: user.email });
});

// API Create Order
app.post('/api/order', (req, res) => {
    const { userId, username, email, productId, productName, price, paymentMethod } = req.body;
    const orders = getOrders();
    const orderId = 'ZNO' + Date.now();
    const order = {
        orderId,
        userId,
        username,
        email,
        productId,
        productName,
        price,
        paymentMethod,
        status: 'pending',
        createdAt: new Date().toISOString()
    };
    orders.push(order);
    saveOrders(orders);
    res.json({ success: true, orderId, order });
});

// API Get Orders by user
app.get('/api/orders/:userId', (req, res) => {
    const orders = getOrders();
    const userOrders = orders.filter(o => String(o.userId) === String(req.params.userId));
    res.json({ success: true, orders: userOrders });
});

// API Confirm Payment (upload bukti)
app.post('/api/confirm-payment', (req, res) => {
    const { orderId, buktiUrl } = req.body;
    const orders = getOrders();
    const idx = orders.findIndex(o => o.orderId === orderId);
    if (idx === -1) return res.json({ success: false, message: 'Order tidak ditemukan!' });
    orders[idx].status = 'confirming';
    orders[idx].buktiUrl = buktiUrl;
    orders[idx].confirmedAt = new Date().toISOString();
    saveOrders(orders);
    res.json({ success: true, message: 'Bukti pembayaran dikirim! Menunggu konfirmasi admin.' });
});

// API Admin - get all orders
app.get('/api/admin/orders', (req, res) => {
    const orders = getOrders();
    res.json({ success: true, orders });
});

// API Admin - approve order
app.post('/api/admin/approve', (req, res) => {
    const { orderId } = req.body;
    const orders = getOrders();
    const idx = orders.findIndex(o => o.orderId === orderId);
    if (idx === -1) return res.json({ success: false, message: 'Order tidak ditemukan!' });
    orders[idx].status = 'paid';
    orders[idx].approvedAt = new Date().toISOString();
    saveOrders(orders);
    res.json({ success: true, message: 'Order approved!' });
});

app.listen(PORT, '0.0.0.0', () => {
    console.log(`✅ Zeno Store berjalan di http://localhost:${PORT}`);
});
