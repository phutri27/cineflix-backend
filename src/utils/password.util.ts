import bcrypt from 'bcrypt'

export const isValid = async (password: string, hashed_password: string) => {
    try {
        const match = await bcrypt.compare(password, hashed_password)
        return match
    } catch (error) {
        console.error(error)
    }
}   

export const genPassword = async (password: string) => {
    try{
        const hashed_password = await bcrypt.hash(password, 15)
        return hashed_password
    } catch(error){
        console.error(error)
    }
}