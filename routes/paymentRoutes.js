const express = require('express')
const { fetchPayment, publishPayment, updatePayment, getLastPayment, avgPerHour} = require('../controllers/paymentController')
const router = express.Router()

router.get('/fetchPayment', fetchPayment)
router.post('/getLastPayment', getLastPayment)
router.post('/publishPayment', publishPayment)
router.patch('/updatePayment', updatePayment)
router.get('/avgPerHour', avgPerHour)

module.exports = router