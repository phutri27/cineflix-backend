import passport from 'passport'
import { Strategy as GoogleStrategy  } from 'passport-google-oauth2'
import { prisma } from '../lib/prisma';
import "dotenv/config"
import { profileObj } from '../dao/profile.dao';

const verifyCallback = async (accessToken: any, refreshToken: any, profile: any, cb: any) =>{
    try {
        const email = profile.emails?.[0].value
        if(!email){
            return cb(null, false, {message: "No email provided by Google"})
        }
        const user = await prisma.user.findFirst({
            where:{
                OR:[
                    {email: profile.emails?.[0].value},
                    {thirdParty:{
                        some:{
                            provider: "GOOGLE",
                            providerAccountId: profile.id
                        }
                    }}
                ]
            },
            omit:{
                hashed_password: true
            },
            include:{
                thirdParty:true
            }
        })

        if (user){
            const findGoogle = user.thirdParty.some(u => u.provider === "GOOGLE")
            if(!findGoogle){
                await prisma.thirdParty.create({
                    data:{
                        provider: "GOOGLE",
                        providerAccountId: profile.id,
                        userId: user.id
                    }
                })
            } 
            const { thirdParty, ...safeUser } = user
            return cb(null, safeUser)
        }

        const user2 = await prisma.user.create({
            data:{
                email: profile.emails?.[0].value,
                first_name: profile.name?.givenName  || '',
                last_name: profile.name?.familyName || '',
                thirdParty:{
                    create: {
                        provider: 'GOOGLE',
                        providerAccountId: profile.id
                    }
                }
            },
            omit: {hashed_password: true}
        })
        await profileObj.createProfile(user2.id)
        return cb(null, user2)
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