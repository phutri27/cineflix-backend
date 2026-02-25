import { v2 as cloudinary } from 'cloudinary'
import "dotenv/config"

cloudinary.config({
    cloud_name: process.env.CLOUDINARY_NAME as string,
    api_key: process.env.CLOUDINARY_API_KEY as string,
    api_secret: process.env.CLOUDINARY_SECRET as string,
    secure: true
})

export default cloudinary