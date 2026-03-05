import multer from 'multer'
import cloudinary from '../config/cloudinary.js'

const storage = multer.diskStorage({
    filename: (req, file, cb) => {
        cb(null, file.originalname)
    }
})

export const upload = multer({storage: storage})    

export const uploadFile = async (filePath: string) => {
    try {
        const result = await cloudinary.uploader.upload(filePath)
        return result
    } catch (error) {
        return console.error(error)
    }
}

export const deleteFile = async (filePublicId: string) => {
    try {
        await cloudinary.uploader.destroy(filePublicId)
    } catch (error) {
        console.error(error)
    }
}