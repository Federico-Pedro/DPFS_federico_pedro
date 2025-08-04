const db = require('../database/models'); 

function userLoggedMiddleware(req, res, next) {
  
  if (req.session.user) {
    res.locals.userLogged = req.session.user;
    return next();
  }

  
  if (req.cookies.userEmail) {
    
    const user = db.User.findOne({
                where: {
                    email: req.cookies.userEmail
                }
            });

    if (user) {
      req.session.user = {
        id: user.user_id,
        name: user.name,
        lastName: user.lastName,
        email: user.email,
        img: user.img,
        type: user.type
      };
      res.locals.userLogged = req.session.user;
    }
  } else {
    res.locals.userLogged = null;
  }

  next();
}

module.exports = userLoggedMiddleware;