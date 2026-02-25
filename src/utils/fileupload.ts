import multer from 'multer'
import cloudinary from '../config/cloudinary.js'

const storage = multer.diskStorage({
    filename: (req, file, cb) => {
        cb(null, file.originalname)
    }
})

export const upload = multer({storage: storage})    

export const uploadFile = (filePath: string) => {
    return new Promise((resolve, reject) => {
        cloudinary.uploader.upload(filePath, (err, result) => {
            if (err) return reject(err)
            return resolve(result)
        })
    })
}