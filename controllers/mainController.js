
let mainController = {
    index: function (req, res) {
        return res.render('index', { title: 'Ratón Blanco', style: 'styles.css', black: '10% off oferta lanzamiento!!'});
    },
    
}
module.exports = mainController