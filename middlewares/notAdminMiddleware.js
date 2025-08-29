function notAdminMiddleware(req, res, next) {

    //Recibe un token del dashboard para poder eliminar productos desde ahí
    const authHeader = req.headers['authorization'];
    if (authHeader) {
        const token = authHeader.split(' ')[1];
        if (token == 'leonardo1452') {
            return next();
        }
    }


    if (req.session.user && req.session.user.role === 'admin') {
        return next();
    } else {

        res.redirect('/');
    }

}

module.exports = notAdminMiddleware;