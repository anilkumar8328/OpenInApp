// routes/sampleRoute.js

const express = require('express');
const router = express.Router();
const {userSignin, createUser} = require('../controllers/UserController')
const {createTask, getAllTask, updateTask, deleteTask} = require('../controllers/TaskController')
const { authenticateUser } = require('../utils/Auth')
const {createSubtask, getAllSubtask, updateSubtask, deleteSubtask} = require('../controllers/SubTaskController')

// user router
router.post('/user', createUser)
router.post('/sign-in', userSignin)

//task routes
router.post('/task', authenticateUser, createTask)
router.get('/task', authenticateUser, getAllTask)
router.put('/task/:id', authenticateUser, updateTask)
router.delete('/task/:id', authenticateUser, deleteTask)

//sub-task routes
router.post('/sub-task', authenticateUser, createSubtask)
router.get('/sub-task', authenticateUser, getAllSubtask)
router.put('/sub-task/:id', authenticateUser, updateSubtask)
router.delete('/sub-task/:id', authenticateUser,deleteSubtask)
 
module.exports = router; 
