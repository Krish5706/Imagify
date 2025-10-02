import axios from "axios";
import mongoose from "mongoose";
import userModel from "../models/userModel.js";
import imageHistoryModel from "../models/imageHistoryModel.js";
import FormData from "form-data";
import fs from "fs";
import path from "path";

export const generateImage = async (req, res) => {
    try {
        const { userId, prompt } = req.body;
        const user = await userModel.findById(userId);
        if (!user || !prompt) {
            return res.json({ success: false, message: 'Missing Details' })
        }
        if (user.creditBalance === 0 || userModel.creditBalance < 0) {
            return res.json({ success: false, message: 'Insufficient Credits', creditBalance: user.creditBalance});
        }

        const formData = new FormData()
        formData.append('prompt', prompt);

       const {data} = await axios.post('https://clipdrop-api.co/text-to-image/v1', formData, {
            headers: {
                'x-api-key': process.env.CLIPDROP_API,
            },
            responseType: 'arraybuffer',
        })

        const imageBuffer = Buffer.from(data, 'binary');
        const imageName = `${Date.now()}_${userId}.png`;
        const imagePath = path.join('uploads', imageName);
        fs.writeFileSync(imagePath, imageBuffer);
        const resultImage = `data:image/png;base64,${imageBuffer.toString('base64')}`

        await userModel.findByIdAndUpdate(user._id,{creditBalance: user.creditBalance - 1})

        // Save generated image to history
        const newHistory = new imageHistoryModel({
            userId: user._id,
            prompt,
            imageUrl: `/uploads/${imageName}`,
            timestamp: new Date()
        });
        await newHistory.save();

        res.json({ success: true, message: 'Image generated successfully',creditBalance: user.creditBalance - 1 ,resultImage});
    }
    catch (error) {
        console.log(error.message)
        res.json({ success: false, message: error.message })
    }

}

export const fetchUserHistory = async (req, res) => {
    try {
        const userId = new mongoose.Types.ObjectId(req.body.userId);
        const page = parseInt(req.query.page) || 1;
        const limit = parseInt(req.query.limit) || 10;
        const skip = (page - 1) * limit;

        const history = await imageHistoryModel.find({ userId }).sort({ timestamp: -1 }).skip(skip).limit(limit);
        const total = await imageHistoryModel.countDocuments({ userId });

        res.json({ success: true, history, total, page, limit });
    } catch (error) {
        console.log(error.message);
        res.json({ success: false, message: error.message });
    }
}

export const deleteHistoryItem = async (req, res) => {
    try {
        const { id } = req.body;
        const userId = req.body.userId;
        const historyItem = await imageHistoryModel.findOne({ _id: id, userId });
        if (!historyItem) {
            return res.json({ success: false, message: 'History item not found or not authorized' });
        }

        // Delete the image file from uploads folder
        const imagePath = path.join('uploads', path.basename(historyItem.imageUrl));
        if (fs.existsSync(imagePath)) {
            fs.unlinkSync(imagePath);
        }

        // Delete the history record from database
        await imageHistoryModel.findOneAndDelete({ _id: id, userId });

        res.json({ success: true, message: 'History item deleted' });
    } catch (error) {
        console.log(error.message);
        res.json({ success: false, message: error.message });
    }
}

import { Types } from 'mongoose';

// Cleanup orphaned images in uploads folder
export const cleanupOrphanedImages = async (req, res) => {
    try {
        // Get all image URLs from database
        const allHistory = await imageHistoryModel.find({}, 'imageUrl');
        const referencedFiles = new Set(allHistory.map(item => path.basename(item.imageUrl)));

        // Read all files in uploads folder
        const uploadDir = path.join('uploads');
        const files = fs.readdirSync(uploadDir);

        // Find files not referenced in database
        const orphanedFiles = files.filter(file => !referencedFiles.has(file));

        // Delete orphaned files
        orphanedFiles.forEach(file => {
            const filePath = path.join(uploadDir, file);
            fs.unlinkSync(filePath);
        });

        res.json({ success: true, message: `Deleted ${orphanedFiles.length} orphaned files.` });
    } catch (error) {
        console.log(error.message);
        res.json({ success: false, message: error.message });
    }
}

// Cleanup old images beyond retention period or limit per user
export const cleanupOldImages = async (req, res) => {
    try {
        const retentionDays = 30; // Retain images for last 30 days
        const retentionDate = new Date();
        retentionDate.setDate(retentionDate.getDate() - retentionDays);

        // Find images older than retentionDate
        const oldImages = await imageHistoryModel.find({ timestamp: { $lt: retentionDate } });

        // Delete image files and DB records
        for (const image of oldImages) {
            const imagePath = path.join('uploads', path.basename(image.imageUrl));
            if (fs.existsSync(imagePath)) {
                fs.unlinkSync(imagePath);
            }
            await imageHistoryModel.deleteOne({ _id: image._id });
        }

        res.json({ success: true, message: `Deleted ${oldImages.length} old images beyond retention period.` });
    } catch (error) {
        console.log(error.message);
        res.json({ success: false, message: error.message });
    }
}
