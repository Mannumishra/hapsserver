
const newsletter = require("../Model/Newsletter");
const Product = require("../Model/ProductModel");
const { uploadimage, deleteImage } = require("../Utils/Cloudnary");
const fs = require("fs");
const transporter = require("../Utils/Mailsender");



const createRecord = async (req, res) => {
    try {
        const { categoryName, productName, productDescription, productSubDescription, productDetails, productSize } = req.body;
        const errorMessage = [];

        if (!categoryName) errorMessage.push("Category Name is Must Required");
        if (!productName) errorMessage.push("Product Name is Must Required");
        if (!productDescription) errorMessage.push("Product Description is Must Required");
        if (!productSubDescription) errorMessage.push("Product Sub-Description is Must Required");
        if (!productDetails) errorMessage.push("Product Details is Must Required");
        if (!productSize) errorMessage.push("Product Size is Must Required");

        if (errorMessage.length > 0) {
            return res.status(403).json({
                success: false,
                message: errorMessage.join(", ")
            });
        }

        const newProduct = new Product({
            categoryName,
            productName,
            productDescription,
            productSubDescription,
            productDetails,
            productSize
        });

        if (req.files) {
            const imageFields = [
                "productImage1",
                "productImage2",
                "productImage3",
                "productImage4",
                "productImage5",
                "productImage6",
                "productImage7",
                "productImage8"
            ];

            for (const field of imageFields) {
                if (req.files[field] && req.files[field][0]) {
                    try {
                        const imgurl = await uploadimage(req.files[field][0].path);
                        newProduct[field] = imgurl;
                        fs.unlinkSync(req.files[field][0].path);
                    } catch (error) {
                        console.error(`Failed to upload image for field ${field}:`, error);
                    }
                }
            }
        }
        await newProduct.save();
        const allMails = await newsletter.find().select('email -_id');
        const mailSendPromises = allMails.map(({ email }) => {
            const mailOptions = {
                from: process.env.MAIL_SENDER,
                to: email,
                subject: `New Product Alert: ${productName}`,
                html: `
            <div style="font-family: Arial, sans-serif; line-height: 1.6; color: #333;">
                <h2 style="color: #007BFF;">Dear Subscriber,</h2>
                <p>We are excited to announce the launch of our new product: <strong>${productName}</strong>.</p>
                <p>Check it out now and enjoy our special offers!</p>
                <a href="https://yourwebsite.com/product-page" style="display: inline-block; padding: 10px 20px; background-color: #28a745; color: #fff; text-decoration: none; border-radius: 5px; margin: 10px 0;">View Product</a>
                <p>Best regards,</p>
                <p>The HAPS Team</p>
            </div>
        `
            };
            return transporter.sendMail(mailOptions);
        });
        await Promise.all(mailSendPromises);
        res.status(200).json({
            success: true,
            message: "Product created successfully",
            data: newProduct
        });
    } catch (error) {
        console.error(error);
        res.status(500).json({
            success: false,
            message: "Internal Server Error"
        });
    }
};

const getRecord = async (req, res) => {
    try {
        const data = await Product.find()
        if (!data) {
            return res.status(404).json({
                success: false,
                message: "Product not found"
            })
        }
        else {
            res.status(200).json({
                success: true,
                message: "Product Found Success Fully",
                data: data
            })
        }
    } catch (error) {
        console.log(error)
        res.status(500).json({
            success: false,
            message: "Internal Server Error"
        })
    }
}

const getSingleRecord = async (req, res) => {
    try {
        const data = await Product.findOne({ _id: req.params._id })
        if (!data) {
            return res.status(404).json({
                success: false,
                message: "Product not found"
            })
        }
        else {
            res.status(200).json({
                success: true,
                message: "Product Found Success Fully",
                data: data
            })
        }
    } catch (error) {
        console.log(error)
        res.status(500).json({
            success: false,
            message: "Internal Server Error"
        })
    }
}

const updateRecord = async (req, res) => {
    try {
        const data = await Product.findOne({ _id: req.params._id });
        if (!data) {
            return res.status(404).json({
                success: false,
                message: "Product not found"
            });
        } else {
            data.productName = req.body.productName ?? data.productName;
            data.productDescription = req.body.productDescription ?? data.productDescription;
            data.productSubDescription = req.body.productSubDescription ?? data.productSubDescription;
            data.productDetails = req.body.productDetails ?? data.productDetails;
            data.categoryName = req.body.categoryName ?? data.categoryName;
            if (req.body.productSize) {
                data.productSize = req.body.productSize.map((size, index) => ({
                    sizeML: size.sizeML ?? data.productSize[index].sizeML,
                    price: size.price ?? data.productSize[index].price,
                    discountPrice: size.discountPrice ?? data.productSize[index].discountPrice,
                    finalPrice: size.finalPrice ?? data.productSize[index].finalPrice,
                    stock: size.stock ?? data.productSize[index].stock
                }));
            }
            if (req.files) {
                const imageFields = [
                    "productImage1",
                    "productImage2",
                    "productImage3",
                    "productImage4",
                    "productImage5",
                    "productImage6",
                    "productImage7",
                    "productImage8"
                ];
                for (const field of imageFields) {
                    if (req.files[field] && req.files[field][0]) {
                        try {
                            const imgurl = await uploadimage(req.files[field][0].path);
                            if (data[field]) {
                                const publicId = data[field].split('/').pop().split('.')[0];
                                await deleteImage(`products/${publicId}`);
                            }
                            data[field] = imgurl.secure_url;
                            fs.unlinkSync(req.files[field][0].path);
                        } catch (error) {
                            console.error(`Failed to upload image for field ${field}:`, error);
                        }
                    }
                }
            }
            await data.save();
            res.status(200).json({
                success: true,
                message: "Product updated successfully",
                data: data
            });
        }
    } catch (error) {
        console.log(error);
        res.status(500).json({
            success: false,
            message: "Internal Server Error"
        });
    }
};


const deleteRecord = async (req, res) => {
    try {
        const data = await Product.findOne({ _id: req.params._id })
        if (!data) {
            return res.status(404).json({
                success: false,
                message: "Product not found"
            })
        }
        else {
            // const allImages = [
            //     data.productImage1,
            //     data.productImage2,
            //     data.productImage3,
            //     data.productImage4,
            //     data.productImage5,
            //     data.productImage6,
            //     data.productImage7,
            //     data.productImage8
            // ];
            const allImages = Object.keys(data.toObject()).filter(key => key.startsWith('productImage')).map(key => data[key]);
            for (const image of allImages) {
                if (image) {
                    const oldImage = image.split('/').pop().split('.')[0];
                    await deleteImage(oldImage);
                }
            }
            await data.deleteOne()
            res.status(200).json({
                success: true,
                message: "Product Deleted Success Fully",
                data: data
            })
        }
    } catch (error) {
        console.log(error)
        res.status(500).json({
            success: false,
            message: "Internal Server Error"
        })
    }
}
module.exports = { createRecord, getRecord, getSingleRecord, deleteRecord, updateRecord };
