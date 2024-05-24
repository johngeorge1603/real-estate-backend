import bcrypt, { hash } from 'bcrypt'
import prisma from '../lib/prisma.js';
import jwt from 'jsonwebtoken';


export const register = async (req,res) => {
    console.log(req.body);

    const {username, email, password} = req.body

    try{

        // Hash Password
        const hashedPassword = await bcrypt.hash(password , 10)
        console.log(hashedPassword);
        
        // Create New User
        const newUser = await prisma.user.create({
            data: {
                username,
                email,
                password:hashedPassword
            }
        })
        
        console.log(newUser);
        res.status(201).json({message: "User created successfuly"})
        } catch(err){
            console.log(err);
            res.status(500).json({message: "Failed to create user"})
        }
    }   




    export const login = async (req,res) => {
        
        const {email, password} = req.body

        try{

            // check if user exists
            const user = await prisma.user.findUnique({
                where: {email: email},
            });
            if(!user) return res.status(401).json({message: "Invalid Credentials"})

                
            //  check is password is correct
            const isPasswordVaild = await bcrypt.compare(password, user.password)

            if(!isPasswordVaild) return res.status(401).json({message: "Invalid Credentials"})

            // generate cookie token
            const age = 1000*60*60*24*7

            const token = jwt.sign({
                id: user.id,
                // isAdmin: true
            },process.env.SECRET_KEY,
            {expiresIn:age});


            const  {password:userPassword,  ...userInfo} = user;

            res.cookie("token", token, {
                httpOnly: true,
                // secure:true,
                maxAge: age,
            }).status(200).json(userInfo)

        } catch(err) {
            console.log(err);
            res.status(500).json({message:"Failed to login"})
        }
}


export const logout = (req,res) => {
    // db operations
    res.clearCookie('token').status(200).json({message:"logout successful"})
} 