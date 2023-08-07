const express = require('express')
const { fetchUser, publishUser, deleteUser, updateUser, loginFunc, loginFuncFromVerify, translateToken, findUserById, findUserExists, changePassword, loginFuncFromToken, updatelicense} = require('../controllers/userController')
const router = express.Router()

router.get('/fetchUser', fetchUser)
router.post('/findUserById', findUserById)
router.post('/publishUser', publishUser)
router.delete('/deleteUser', deleteUser)
router.patch('/updateUser', updateUser)
router.patch('/updatelicense', updatelicense)
router.post('/loginFunc', loginFunc) 
router.post('/loginFuncFromVerify', loginFuncFromVerify)
router.post('/translateToken', translateToken)
router.post('/findUserExists', findUserExists)
router.patch('/changePassword', changePassword) 
router.post('/loginFuncFromToken', loginFuncFromToken)

module.exports = router