const express = require('express')
const { fetchPayment, publishPayment, updatePayment, getLastPayment} = require('../controllers/paymentController')
const router = express.Router()

router.get('/fetchPayment', fetchPayment)
router.post('/getLastPayment', getLastPayment)
router.post('/publishPayment', publishPayment)
router.patch('/updatePayment', updatePayment)

module.exports = router