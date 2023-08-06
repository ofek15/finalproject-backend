const express = require('express')
const { fetchParking, publishParking, deleteParking, updateParking, findOneParking, availableParking, availableParkingAndDistance, changeStatus} = require('../controllers/parkingController')
const router = express.Router()

router.get('/fetchParking', fetchParking)
router.post('/publishParking', publishParking)
router.delete('/deleteParking', deleteParking)
router.patch('/updateParking', updateParking)
router.post('/findOneParking', findOneParking)
router.get('/availableParking', availableParking)
router.post('/availableParkingAndDistance', availableParkingAndDistance)
router.patch('/changeStatus', changeStatus)

module.exports = router