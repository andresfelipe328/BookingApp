// Imports
const passport = require('passport')
const passportLocal = require('passport-local');
const loginService = require('./loginService');
let localStrategy = passportLocal.Strategy;

// Handles Authentication
let initialPassportLocal = () => {
  passport.use(new localStrategy({
    usernameField: 'email',
    },
    async (email, password, done) => {
      try {
        let user = await loginService.findUserByEmail(email);
        if (!user)
          return done(null, false, { message: "This username does not exist"});
        else {
          let match = await loginService.comparePassword(user, password);
          if (match === true)
            return done(null, user, null)
          else
            return done(null, false, { message: match})
        }
      }
      catch (err) {
          return done(null, false, { message: err });
      }
  }));
};

// Serialize user
passport.serializeUser((user, done) => {
  done(null, user.patient_id)
})

// Deserialize user
passport.deserializeUser((id, done) => {
  loginService.findUserById(id).then((user) => {
    return done(null, user)
  }).catch(error => {
    return done(error, null)
  })
})

// Exports
module.exports = initialPassportLocal;