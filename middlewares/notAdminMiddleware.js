function notAdminMiddleware (req, res, next) {
    if(req.session.user && req.session.user.type === 'admin'){
        next();
    }
    res.redirect('/');
    
}

module.exports = notAdminMiddleware;