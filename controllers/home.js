/**
 * GET /
 * Home page.
 */
exports.index = (req, res) => {
  res.render('home2', {
    title: 'Home'
  });
}; 

/**
 * GET /home2
 * Home page.
 */
exports.secondary = (req, res) => { 
  res.render('home2', {
    title: 'Home2'
  });
};
