const express = require('express')
const { fetchUser, publishUser, deleteUser, updateUser, loginFunc, translateToken, findUserById} = require('../controllers/userController')
const router = express.Router()

router.get('/fetchUser', fetchUser)
router.post('/findUserById', findUserById)
router.post('/publishUser', publishUser)
router.delete('/deleteUser', deleteUser)
router.patch('/updateUser', updateUser)
router.post('/loginFunc', loginFunc)
router.post('/translateToken', translateToken)

module.exports = router