const express = require('express')
const { fetchPayment, publishPayment, updatePayment} = require('../controllers/paymentController')
const router = express.Router()

router.get('/fetchPayment', fetchPayment)
router.post('/publishPayment', publishPayment)
router.patch('/updatePayment', updatePayment)

module.exports = router