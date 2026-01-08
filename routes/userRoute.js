const express =  require('express')
const userController = require('../controllers/userController')
const {auth} = require('../middleware/auth')
const upload = require('../middleware/multer')
const router = express.Router()


router.post('/register', upload.single('userImage'),userController.register)
router.post('/login',userController.login)
router.get('/getUserInfo',auth, userController.getUserInfo)
router.get('/doctorList',auth, userController.doctorList)
// router.put('/updateUser', auth, upload, userController.updateUser)

module.exports = router