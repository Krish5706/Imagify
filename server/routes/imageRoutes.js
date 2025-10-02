import express from 'express'

import { generateImage, fetchUserHistory, deleteHistoryItem, cleanupOrphanedImages, cleanupOldImages } from '../controllers/imageController.js'
import userAuth from '../middlewares/auth.js'

const imageRouter = express.Router()

imageRouter.post('/generate-image',userAuth, generateImage)
imageRouter.get('/user-history', userAuth, fetchUserHistory)
imageRouter.delete('/delete-history', userAuth, deleteHistoryItem)
imageRouter.post('/cleanup-orphaned-images', userAuth, cleanupOrphanedImages)
imageRouter.post('/cleanup-old-images', userAuth, cleanupOldImages)

export default imageRouter
