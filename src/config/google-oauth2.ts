import passport from 'passport'
import { Strategy as GoogleStrategy  } from 'passport-google-oauth2'
import { prisma } from '../lib/prisma.js';
import "dotenv/config"
import { AuthProvider } from '../../generated/prisma/enums.js';

const verifyCallback = async (accessToken: any, refreshToken: any, profile: any, cb: any) =>{
    try {
        let user = await prisma.user.findFirst({
            where:{
                OR:[
                    {googleId: profile.id},
                    {email: profile.emails?.[0].value}
                ]
            }
        })
        if (user){
            if (!user.googleId){
                user = await prisma.user.update({
                    where: {
                        id: user.id
                    },
                    data:{ googleId: profile.id, provider: 'GOOGLE'}
                })
            }
            return cb(null, user)
        }
        user = await prisma.user.create({
            data:{
                email: profile.emails?.[0].value,
                first_name: profile.name?.givenName  || '',
                last_name: profile.name?.familyName || '',
                googleId: profile.id,
                provider: 'GOOGLE'
            }
        })
        return cb(null, user)
    } catch (error) {
        console.error(error)
        return cb(error, undefined)
    }
}

const strategy = new GoogleStrategy({
    clientID: process.env['GOOGLE_CLIENT_ID'] as string,
    clientSecret: process.env['GOOGLE_CLIENT_SECRET'] as string,
    callbackURL: process.env['GOOGLE_CALLBACK_URL'] as string,
    scope: ['profile', 'email'],
}, verifyCallback)

passport.use(strategy)