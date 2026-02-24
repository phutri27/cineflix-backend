import passport from 'passport'
import { Strategy as LocalStrategy } from 'passport-local'
import { prisma } from '../lib/prisma.js';
import { isValid } from '../utils/password.util.js';

const customFields = {
    usernameField: 'email',
    passwordField: 'pw'
}

const verifyCallback = async (username: string, password: string, done: any) => {
    try{
        const user = await prisma.user.findUnique({
            where:{
                email: username
            }
        })
        if (!user) {
            return done(null, false, {message: "Incorrect username or password"})
        }
        const valid = await isValid(password, user.hashed_password)
        if (!valid){
            return done(null, false, {message: "Incorrect username or password"})
        }
        const { hashed_password, ...safeUser } = user
        return done(null, safeUser)
    } catch(err){
        return done(err)
    }
}

const strategy = new LocalStrategy(customFields, verifyCallback)
passport.use(strategy)
    
passport.serializeUser((user: any, done) => {
    const payload = {
        id: user.id,
        role: user.role,
        email: user.email
    }
    done(null, payload)
})

passport.deserializeUser(async (sessionData: any, done) => {
    try{
        done(null, sessionData)
    } catch(err){
        done(err)
    }
})
