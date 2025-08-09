function notAdminMiddleware(req, res, next) {
    if (req.session.user && req.session.user.role === 'admin') {
       return next();
    } else {

        res.redirect('/');
    }

}

module.exports = notAdminMiddleware;