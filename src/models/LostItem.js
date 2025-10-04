import mongoose from "mongoose"

const lostItemSchema = new mongoose.Schema({
    title: {
        type: String,
        requied: true,
        trim: true
    },
    description: {
        type: String,
        requied: true
    },
    locationLost: {
        type: String,
        requied: true
    },
    dateLost: {
        type: Date,
        requied: true
    },
    image: {
        type: String,
        requied: true
    },
    contactInfo: {
        name: { type: String, requied: true },
        phone: { type: String },
        email: { type: String }
    },
    userId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "User"
    },
    status: {
        type: String,
        enum: ["Kayıp", "Bulundu", "Bulunamadı"],
        default: "Kayıp"
    },
}, { timestamps: true })

const LostItem = mongoose.model("LostItem", lostItemSchema);

export default LostItem;