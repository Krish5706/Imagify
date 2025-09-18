import mongoose from "mongoose";

const imageHistorySchema = new mongoose.Schema({
    userId: { type: mongoose.Schema.Types.ObjectId, ref: 'user', required: true },
    prompt: { type: String, required: true },
    imageUrl: { type: String, required: true },
    timestamp: { type: Date, default: Date.now }
});

const imageHistoryModel = mongoose.models.imageHistory || mongoose.model("imageHistory", imageHistorySchema);

export default imageHistoryModel;
