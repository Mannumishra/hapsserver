const cloudinary = require("cloudinary").v2;

cloudinary.config({
    cloud_name: process.env.CLOUD_NAME,
    api_key: process.env.API_KEY,
    api_secret: process.env.API_SERC
})

const uploadimage = async (file) => {
    try {
        const imageurl = await cloudinary.uploader.upload(file)
        return imageurl.secure_url
    } catch (error) {
        console.log(error)
    }
}

const deleteImage = async (file) => {
    try {
        await cloudinary.uploader.destroy(file)
    } catch (error) {
        console.log(error)
    }
}

module.exports = { uploadimage, deleteImage }
