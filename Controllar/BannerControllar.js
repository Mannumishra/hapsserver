const banner = require("../Model/Banner");
const { uploadimage, deleteImage } = require("../Utils/Cloudnary");
const fs = require("fs")

const createBanner = async (req, res) => {
    try {
        if (!req.file) {
            return res.status(400).json({
                success: false,
                mess: "Please choose the file"
            });
        }
        const bannerImageUrl = await uploadimage(req.file.path);
        if (!bannerImageUrl) {
            return res.status(500).json({
                success: false,
                mess: "Image upload failed"
            });
        }
        const newBanner = new banner({ bannerImage: bannerImageUrl });
        await newBanner.save();
        try {
            fs.unlinkSync(req.file.path)
        } catch (error) { }
        res.status(200).json({
            success: true,
            mess: "New banner added successfully",
            data: newBanner
        });
    } catch (error) {
        res.status(500).json({
            success: false,
            mess: "Internal Server Error"
        });
    }
};

const getBanner = async (req, res) => {
    try {
        const data = await banner.find()
        if (!data) {
            return res.status(404).json({
                success: false,
                mess: "No Banner Found"
            });
        } else {
            res.status(200).json({
                success: true,
                mess: "Banner Found Successfully",
                data: data
            });
        }
    } catch (error) {
        console.error(error);
        res.status(500).json({
            success: false,
            mess: "Internal Server Error"
        });
    }
};

const getSingleRecord = async (req, res) => {
    try {
        const data = await banner.findOne({ _id: req.params._id })
        if (data) {
            res.status(200).json({
                success: true,
                mess: "Banner Found Successfully",
                data: data
            })
        }
        else {
            res.status(404).json({
                success: false,
                mess: "Banner Not found Successfully"
            })
        }
    } catch (error) {
        console.log(error)
        res.status(500).json({
            success: false,
            mess: "Internal Server Error"
        })
    }
}

const updateRecord = async (req, res) => {
    try {
        const data = await banner.findOne({ _id: req.params._id })
        if (data) {
            if (req.file) {
                const oldImage = data.bannerImage.split("/").pop().split(".")[0]
                try {
                    await deleteImage(oldImage)
                } catch (error) { }
                const imgurl = await uploadimage(req.file.path)
                data.bannerImage = imgurl
                await data.save()
                try {
                    fs.unlinkSync(req.file.path)
                } catch (error) { }
                return res.status(200).json({
                    success: true,
                    mess: "Banner Updated Successfully",
                    data: data
                })
            }
            res.status(200).json({
                success: true,
                mess: "Banner Not Updated Because you not Select the new banner",
                data: data
            })
        }
        else {
            return res.status(404).json({
                success: true,
                mess: "Record not found"
            })
        }
    } catch (error) {
        console.log(error)
        res.status(500).json({
            success: false,
            mess: "Internal Server Error"
        })
    }
}

const deleteBanner = async (req, res) => {
    try {
        const data = await banner.findOne({ _id: req.params._id })
        if (data) {
            const oldimage = data.bannerImage.split("/").pop().split(".")[0]
            try {
                await deleteImage(oldimage)
            } catch (error) { }
            await data.deleteOne()
            res.status(200).json({
                success: false,
                mess: "Banner Deleted Successfully"
            })
        }
        else {
            res.status(404).json({
                success: false,
                mess: "Banner Not Found"
            })
        }
    } catch (error) {
        res.status(500).json({
            success: false,
            mess: "Internal Server Error"
        })
    }
}

module.exports = {
    createBanner: createBanner,
    getBanner: getBanner,
    updateRecord: updateRecord,
    getSingleRecord: getSingleRecord,
    deleteBanner: deleteBanner
};
