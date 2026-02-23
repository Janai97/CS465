const express = require('express');
const router = express.Router();
const axios = require('axios');

function requireAdmin(req, res, next) {
  if (!res.locals.user) return res.redirect('/login');
  if (!res.locals.isAdmin)
    return res.status(403).render('admin', {
      title: 'Travlr Getaways | Admin',
      message: 'Access denied. Admins only.',
    });
  next();
}

router.get('/', (req, res) => {
  res.render('index', { title: 'Travlr Getaways' });
});

router.get('/news', (req, res) => {
  res.render('news', { title: 'Travlr Getaways | News' });
});

router.get('/reservations', (req, res) => {
  res.render('reservations', { title: 'Travlr Getaways | Reservations' });
});

router.get('/admin', requireAdmin, (req, res) => {
  res.render('admin', { title: 'Travlr Getaways | Admin' });
});

// Checkout
router.get('/checkout', (req, res) => {
  const cart = req.session?.cart || [];
  const total = cart.reduce((sum, item) => {
    const price = parseFloat(item.perPerson) || 0;
    return sum + price * (item.qty || 0);
  }, 0);

  res.render('checkout', {
    title: 'Travlr Getaways | Checkout',
    cart,
    total: total.toFixed(2),
  });
});

router.post('/checkout/remove', (req, res) => {
  const code = req.body.code;
  if (!req.session?.cart) return res.redirect('/checkout');
  req.session.cart = req.session.cart.filter((x) => x.code !== code);
  return res.redirect('/checkout');
});

router.post('/checkout/clear', (req, res) => {
  req.session.cart = [];
  return res.redirect('/checkout');
});

// Login page
router.get('/login', (req, res) => {
  res.render('login', { title: 'Travlr Getaways | Login' });
});

// Handle login form -> calls API -> stores token cookie
router.post('/login', async (req, res) => {
  try {
    const payload = { email: req.body.email, password: req.body.password };
    const resp = await axios.post('http://localhost:3000/api/login', payload);

    if (resp.data?.token) {
      res.cookie('travlr-token', resp.data.token, { httpOnly: true });
      return res.redirect('/');
    }

    return res.render('login', {
      title: 'Travlr Getaways | Login',
      error: 'Login failed.',
    });
  } catch (err) {
    return res.render('login', {
      title: 'Travlr Getaways | Login',
      error: 'Login failed. Check your credentials and try again.',
    });
  }
});

// Register page
router.get('/register', (req, res) => {
  res.render('register', { title: 'Travlr Getaways | Sign Up' });
});

// Handle register form -> calls API -> stores token cookie
router.post('/register', async (req, res) => {
  try {
    const payload = {
      name: req.body.name,
      email: req.body.email,
      password: req.body.password,
    };

    const resp = await axios.post('http://localhost:3000/api/register', payload);

    if (resp.data?.token) {
      res.cookie('travlr-token', resp.data.token, { httpOnly: true });
      return res.redirect('/');
    }

    return res.render('register', {
      title: 'Travlr Getaways | Sign Up',
      error: 'Registration failed.',
    });
  } catch (err) {
    return res.render('register', {
      title: 'Travlr Getaways | Sign Up',
      error: 'Registration failed. Try a different email.',
    });
  }
});

// Logout clears cookie
router.get('/logout', (req, res) => {
  res.clearCookie('travlr-token');
  return res.redirect('/');
});

module.exports = router;