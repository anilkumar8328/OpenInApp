
const User = require('../models/UserModel')
const {generateToken} = require('../utils/Auth')
const {CustomError} = require('../utils/ErrorHandler')

exports.createUser = async (req,res,next) => {
    try {
        const { phone_number, priority } = req.body;
    
        // Check if a user with the given phone_number already exists
        const existingUser = await User.findOne({ phone_number });
    
        if (existingUser) {
          throw new CustomError(400, 'User with the provided phone number already exists');
        }
    
        // Create a new user
        const newUser = new User({
          phone_number,
          priority,
        });
    
        // Save the new user to the database
        await newUser.save();
    
        res.status(201).json({ message: 'User created successfully' });
      } catch (error) {
        next(error)
      }
}

exports.userSignin = async (req,res,next)=> {
    try {
        
        const { userId} = req.body;
        const userData = await User.findOne({_id : userId});
        console.log(userData.id);
        if (!userData) {
            throw new CustomError('User not found');
        }
        const token =  generateToken(userData.id);

        return res.send({
            status : 200,
            message : "Success",
            data : token
        })
    } catch (error) {
        console.log("userData",error)
        next(error);
    } 
}



