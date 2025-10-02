import dotenv from 'dotenv';
dotenv.config();
import mongoose from 'mongoose';
import imageHistoryModel from './models/imageHistoryModel.js';
import fs from 'fs';
import path from 'path';

async function cleanup() {
  try {
    await mongoose.connect(process.env.MONGODB_URI);
    const allHistory = await imageHistoryModel.find({}, 'imageUrl');
    const referencedFiles = new Set(allHistory.map(item => path.basename(item.imageUrl)));
    const uploadDir = path.join('uploads');
    const files = fs.readdirSync(uploadDir);
    const orphanedFiles = files.filter(file => !referencedFiles.has(file));
    orphanedFiles.forEach(file => {
      const filePath = path.join(uploadDir, file);
      fs.unlinkSync(filePath);
      console.log(`Deleted ${file}`);
    });
    console.log(`Deleted ${orphanedFiles.length} orphaned files.`);
  } catch (error) {
    console.log(error.message);
  } finally {
    mongoose.disconnect();
  }
}

cleanup();
