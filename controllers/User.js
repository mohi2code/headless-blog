const validator = require('validator');
const jwt       = require('jsonwebtoken');
const ac        = require('../ac');

module.exports = (models) => {

  async function createUser (req, res, next){

    let errors = validateCreateRequest(req.body);

    // extracting keys from req.body object
    let { username, email, password, password2, role } = req.body;

    // confirm there is no errors
    if (errors.length > 0)
      res.status(422).send(errors);
    else {
      try {

        // validate admin user addition
        if (role == 'admin' && !req.user.superadmin)
          throw new Error('superadmin token needed to create new admin');

        // insert user in the database
        let user = await models.Users.create(
          {
            username,
            email,
            password,
            role
          }
        );

        // verify it exists
        if (user) {

          // generate token
          let token = jwt.sign(
            {
              username: user.username,
              email: user.email,
              role: user.role
            }, 'key');
          res.send({ token });

        }

      } catch (err) {
        res.status(422).send({ msg: 'Cannot add user'});
        console.log(err);
      }
    }

  }

  async function authenticate(req, res, next) {
    try {

      if (!req.headers['authorization']) {
        next();
        return;
      }

      // destruct the token from the request
      let token = req.headers['authorization'].split(' ')[1];

      // decode the token
      let decoded = jwt.verify(token, 'key');

      // check if superadmin token
      if (decoded.superadmin){
        req.user = { superadmin: true };
        req.isAuthorized = true;
        next();
        return;
      }

      // check if user exists in the database
      let user = await models.Users.findOne({where: { username: decoded.username }});

      if (user) {

        // format req.user object
        req.user = Object.assign({}, {
          username: user.username,
          email: user.email,
          role: user.role
        });

        req.isAuthenticated = true;
        next();

      } else {
        req.isAuthenticated = false;
        next();
      }

    } catch (err) {
      console.log(err);
      req.isAuthenticated = false;
      next();
    }
  }

  function authorize(action) {
    return (req, res, next) => {

      // check if user is already authenticated
      if (req.isAuthenticated) {

        let user = req.user;

        // switch actions
        //createAny
        if (action.action == 'CA'){

          let permission = ac.can(user.role).createAny(action.rsc);

          if (permission.granted) {
            req.isAuthorized = true;
            next();
          }

        // updateOwn
        } else if (action.action == 'UO') {

          let permission = ac.can(user.role).updateOwn(action.rsc);

          if (permission.granted) {
            req.isAuthorized = true;
            next();
          }

          // deleteOwn
        } else if (action.action == 'DO') {

          let permission = ac.can(user.role).deleteOwn(action.rsc);

          if (permission.granted) {
            req.isAuthorized = true;
            next();
          }

        } else {
          req.isAuthorized = false;
          next();
        }

      } else {
        next();
      }

      if (!req.isAuthorized) {
        next();
        return;
      }


    }
  }

  function validateCreateRequest(body) {

    let errors = [];

    // extracting keys from req.body object
    let { username, email, password, password2, role } = body;

    // validate data completion
    if (!username || !email || !password || !password2 || !role)
      errors.push({ msg: 'Missing Data' });
    else {

      // validate passwords matching
      if (password !== password2)
        errors.push({ msg: 'Passwords dont match' });

      // validate password length
      if (password.length < 6 || password.length > 17)
        errors.push({ msg: 'Password need to be between 6 and 17 characters long' });

      // validate email
      if (!validator.isEmail(email))
        errors.push({ msg: 'Invalid Email' });

      // validate role
      if (!validator.isIn(role, ['admin', 'author', 'public']))
        errors.push({ msg: 'Invalid role type' });

    }

    return errors;

  }

  return { createUser, authenticate, authorize };

};
