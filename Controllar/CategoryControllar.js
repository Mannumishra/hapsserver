const category = require("../Model/Category")
const { uploadimage, deleteImage } = require("../Utils/Cloudnary")
const fs = require("fs")

const createRecord = async (req, res) => {
    try {
        // console.log(req.body);
        const { categoryName } = req.body;
        if (!categoryName) {
            return res.status(400).json({
                success: false,
                mess: "Category name is required"
            });
        }
        const oldName = await category.findOne({ categoryName: { $regex: `^${categoryName}$`, $options: 'i' } });
        // const oldName = await category.findOne({ categoryName: { $regex: new RegExp(`^${categoryName}$`, 'i') } });
        if (oldName) {
            return res.status(409).json({
                success: false,
                mess: "Category name already exists"
            });
        }

        const data = new category({ categoryName: categoryName });
        // console.log(req.file);
        if (req.file) {
            try {
                const imgurl = await uploadimage(req.file.path);
                data.categoryImage = imgurl;
            } catch (error) {
                console.error('Error uploading image:', error);
                return res.status(500).json({
                    success: false,
                    mess: "Error uploading image"
                });
            }
        }

        await data.save();

        try {
            if (req.file) {
                fs.unlinkSync(req.file.path);
            }
        } catch (error) {
            console.error('Error deleting temporary file:', error);
        }

        res.status(200).json({
            success: true,
            mess: "New category added successfully",
            data: data
        });

    } catch (error) {
        // console.log(error);
        res.status(500).json({
            success: false,
            mess: "Internal Server Error"
        });
    }
};


const getAllRecord = async (req, res) => {
    try {
        const data = await category.find()
        if (!data) {
            res.status(404).json({
                success: true,
                mess: "Category Not Found Successfully",
            })
        }
        else {
            res.status(200).json({
                success: true,
                mess: "Category  Found Successfully",
                data: data
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

const getSingleRecord = async (req, res) => {
    try {
        const data = await category.findOne({ _id: req.params._id })
        if (!data) {
            res.status(404).json({
                success: true,
                mess: "Category Not Found Successfully",
            })
        }
        else {
            res.status(200).json({
                success: true,
                mess: "Category  Found Successfully",
                data: data
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
        const data = await category.findOne({ _id: req.params._id })
        if (!data) {
            res.status(404).json({
                success: true,
                mess: "Category Not Found Successfully",
            })
        }
        else {
            data.categoryName = req.body.categoryName ?? data.categoryName
            if (req.file) {
                const oldImage = data.categoryImage.split("/").pop().split(".")[0]
                try {
                    await deleteImage(oldImage)
                } catch (error) { }
                const imgurl = await uploadimage(req.file.path)
                data.categoryImage = imgurl
            }
            await data.save()
            res.status(200).json({
                success: true,
                mess: "Category Update Successfully",
                data: data
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

const deleteRecord = async (req, res) => {
    try {
        const data = await category.findOne({ _id: req.params._id })
        if (!data) {
            res.status(404).json({
                success: true,
                mess: "Category Not Found Successfully",
            })
        }
        else {
            const oldImage = data.categoryImage.split("/").pop().split(".")[0]
            try {
                await deleteImage(oldImage)
            } catch (error) { }
            await data.deleteOne()
            res.status(200).json({
                success: true,
                mess: "Category  Delete Successfully"
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

module.exports = {
    createRecord: createRecord,
    getAllRecord: getAllRecord,
    getSingleRecord: getSingleRecord,
    updateRecord: updateRecord,
    deleteRecord: deleteRecord
}