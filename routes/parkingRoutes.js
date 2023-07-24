const express = require('express')
const { fetchParking, publishParking, deleteParking, updateParking} = require('../controllers/parkingController')
const router = express.Router()

router.get('/fetchParking', fetchParking)
router.post('/publishParking', publishParking)
router.delete('/deleteParking', deleteParking)
router.patch('/updateParking', updateParking)

module.exports = router