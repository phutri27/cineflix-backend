import multer from 'multer'
import cloudinary from '../config/cloudinary.js'

const storage = multer.diskStorage({
    filename: function (req, file, cb) {
        const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1E9)
        cb(null, file.fieldname + '-' + uniqueSuffix)
    }
})

export const upload = multer({storage: storage})    

export const uploadFile = async (filePath: string, folderUrl: string) => {
    try {
        const result = await cloudinary.uploader.upload(filePath, {folder: folderUrl})
        return result
    } catch (error) {
        return console.error(error)
    }
}

export const deleteFile = async (filePublicId: string) => {
    try {
        await cloudinary.uploader.destroy(filePublicId, {invalidate: true})
    } catch (error) {
        console.error(error)
    }
}

export const uploadBufferFile = async (buffer: Buffer, folderUrl: string) => {
    try {
        return new Promise((resolve, reject) => {
            cloudinary.uploader.upload_stream({folder: folderUrl}, (error, result) => {
                if (error){
                    return reject(error)
                }
                return resolve(result)
            }).end(buffer)
        })
    } catch (error) {
        console.error(error)
    }
}