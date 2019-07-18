const passport = require('koa-passport');
const User = require('./models/user');
const sodium = require('sodium').api;

const LocalStrategy = require('passport-local').Strategy;

passport.serializeUser((user, done) => { 
    done(null, user);
});

passport.deserializeUser(async (id, done) => {
    try {
        const user = await User.findById(id);
        done(null, user);
    } catch(err) {
        done(err);
    }
});

passport.use(new LocalStrategy({}, (username, password, done) => {
    User.findOne({ username: username })
    .then((user) => {
    if (!user) {
        console.log("no user")
        return done(null, false);
    }
    if (!user.validPassword(password)) {
        console.log("passwords don't match")
        return done(null, false);
    } else {
        return done(null, user);
    }
    })
    .catch((err) => { 
        return done(err); 
    });
}));
