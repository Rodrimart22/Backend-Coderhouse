import passport from 'passport';
import GitHubStrategy from 'passport-github2';
import usersModel from '../models/users.model.js';

const initializePassport = () => {
    //Implementación de nuestro mecanismo de autenticación con github
    passport.use('github', new GitHubStrategy({
        clientID: 'Iv23ct1AOPdy6VFiA7UA',
        clientSecret: 'ae1717053f7fc1c5936a565382b05860ae75ef93',
        callbackURL: 'http://localhost:8080/api/sessions/github-callback',
        scope: ['user:email']
    }, async (accessToken, refreshToken, profile, done) => {
        try {
            console.log(profile);
            // {
                    // _json: {
                    //     name: 'alex'
                    // }
            //     emails: [{value: 'ap@hotmail.com'}]
            // }
            const email = profile.emails[0].value;
            const user = await usersModel.findOne({ email });

            if(!user) {
                //crear la cuenta o usuario desde cero
                const newUser = {
                    first_name: profile._json.name,
                    last_name: '',
                    age: 18,
                    email,
                    password: ''
                }

                const result = await usersModel.create(newUser);
                return done(null, result); //req.user {first,last,age,email}
            } else {
                return done(null, user);
            }
        } catch (error) {
            return done(`Incorrect credentials`)
        }
    }));

    //Serializaccion y DeSerializaccion
    passport.serializeUser((user, done) => {
        done(null, user._id);
    });

    passport.deserializeUser(async(id, done) => {
        const user = await usersModel.findById(id);
        done(null, user);
    })
}

export {
    initializePassport
}