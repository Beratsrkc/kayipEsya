import express, { Router } from "express"
import clouinary from "../lib/cloudinary.js"
import LostItem from "../models/LostItem.js"
import protectRoute from "../middleware/auth.middleware.js"

const router = express.Router()

router.post("/add", protectRoute, async (req, res) => {
    try {
        const { title, description, locationLost, dateLost, image, contactInfo, status } = req.body

        if (!title || !description || !locationLost || !dateLost || !image || !contactInfo || !status) {
            return res.status(400).json({ message: "Lütfen tüm alanları doldurun" })
        }

        const uploadResponse = await clouinary.uploader.upload(image)
        const imageUrl = uploadResponse.secure_url

        const newLostItem = new LostItem({
            title,
            description,
            locationLost,
            dateLost,
            contactInfo,
            status,
            image: imageUrl,
            user: req.user._id,
        })

        await newLostItem.save()

    } catch (error) {
        console.log("Error creating Lost Item", error);
        res.status(500).json({ message: error.message });
    }
})

router.get("/", protectRoute, async (req, res) => {
    try {
        const page = req.query.page || 1;
        const limit = req.query.limit || 2;
        const skip = (page - 1) * limit;

        const items = await LostItem.find()
            .sort({ createdAt: -1 }) // desc
            .skip(skip)
            .limit(limit)
            .populate("user", "username");

        const totalItems = await LostItem.countDocuments();

        res.send({
            items,
            currentPage: page,
            totalBooks,
            totalPages: Math.ceil(totalItems / limit),
        })
    } catch (error) {
    console.log("Error in get all items route", error);
    res.status(500).json({ message: "Internal server error" });
    }
})

router.get("/user",protectRoute,async(req,res)=>{
    try {
        const items= await LostItem.find({user:req.user._id}).sort({ createdAt: -1 })
        res.json(items)
    } catch (error) {
        console.error("Get user items error:", error.message);
    res.status(500).json({ message: "Server error" });
    }
})

router.delete("/:id",protectRoute,async (req,res)=>{
   try{
    const item = await LostItem.findById(req.params.id)
    if (!item) return res.status(404).json({ message: "Item not found" });

    if(item.user.toString() !== req.user._id.toString())
         return res.status(401).json({ message: "Unauthorized" });
    
     if (item.image && item.image.includes("cloudinary")) {
      try {
        const publicId = item.image.split("/").pop().split(".")[0];
        await cloudinary.uploader.destroy(publicId);
      } catch (deleteError) {
        console.log("Error deleting image from cloudinary", deleteError);
      }
    }

    await item.deleteOne()

     res.json({ message: "Item deleted successfully" });
  } catch (error) {
    console.log("Error deleting item", error);
    res.status(500).json({ message: "Internal server error" });
  }
})

export default router;