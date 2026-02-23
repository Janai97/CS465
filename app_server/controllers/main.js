const baseViewData = {
  year: new Date().getFullYear()
};

/* HOME */
const index = (req, res) => {
  res.render('index', { ...baseViewData, title: 'Travlr Getaways' });
};

/* TRAVEL */
const travel = (req, res) => {
  res.render('travel', { ...baseViewData, title: 'Travel' });
};

/* NEWS */
const news = (req, res) => {
  res.render('news', { ...baseViewData, title: 'News' });
};

/* ADMIN */
const admin = (req, res) => {
  res.render('admin', { ...baseViewData, title: 'Admin' });
};

/* LOGIN */
const login = (req, res) => {
  res.render('login', { ...baseViewData, title: 'Login' });
};

/* SIGNUP */
const signup = (req, res) => {
  res.render('signup', { ...baseViewData, title: 'Sign Up' });
};

/* RESERVATIONS */
const reservations = (req, res) => {
  res.render('reservations', { ...baseViewData, title: 'Reservations' });
};

/* CHECKOUT */
const checkout = (req, res) => {
  res.render('checkout', { ...baseViewData, title: 'Checkout' });
};

module.exports = {
  index,
  travel,
  news,
  admin,
  login,
  signup,
  reservations,
  checkout
};