import passport from 'passport';
import User from '../entities/usersModel';
const BearerStrategy = require('passport-http-bearer');

export const configurePassportHttpBearer = () => passport.use(new BearerStrategy(
    async (token: any, done: any) => {
      const user = await new User({bearerToken: token}).fetch({require: false});
        if (!user){ 
            return done(null, false); 
        }
        return done(null, user, { scope: 'all' });
    }
));