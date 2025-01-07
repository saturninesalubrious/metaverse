import { response, Router } from "express";
import { userRouter } from "./user";
import { spaceRouter } from "./space";
import { adminRouter } from "./admin";
import { SigninSchema, SignupSchema } from "../../types";
import client from "@repo/db/client"
import bcrypt from "bcrypt"
import jwt from "jsonwebtoken"
import { JWT_PASSWORD } from "../../config";

export const router = Router();

router.get("/signup", async (req, res) => {
 //check the user

 const parsedData = SignupSchema.safeParse(req.body)

 if(!parsedData.success) {
  res.status(400).json({message: "Validation failed"})
  return
 }

 try {
  const user =  await client.user.create({
   data: {
    username: parsedData.data.username,
    password: parsedData.data.password,
    avatarId: parsedData.data.type === "admin" ? "admin" : "user",
    role:     parsedData.data.type === "admin" ? "Admin"  : "User"
   }
  })


  res.json({
   userId: user.id
  })

 } catch (e) {
  res.status(400).json({message: "User already exists"})

 }

res.json({
 message: "Signup"
})
})

router.get("/signin", async (req, res) => {

 const parsedData = SigninSchema.safeParse(req.body)

 if(!parsedData.success) {
  res.status(400).json({message: "Validation failed"})
  return
 }

 const hashedPassword = await bcrypt.hash(parsedData.data.password, 10)


try {
 const user = await client.user.findUnique({
  where: {
   username: parsedData.data.username
  }
 })

 if (!user) {
  res.status(403).json({message: "User not found"})
  return
 }

 const isValid = await bcrypt.compare(parsedData.data.password, user.password)

 if(!isValid) {
  res.status(403).json({message: "Invalid password"})
  return
 }

 const token = jwt.sign({userId: user.id,
  role: user.role
 }, JWT_PASSWORD)

} catch (e) {

 res.status(403).json({message: "Validation failed"})

}


 res.json({
  message: "Signin"
 })

})

router.get("/element", (req, res) => {

})

router.get("/avatars", (req,res) => {

})

router.use("/user" , userRouter)
router.use("/space" , spaceRouter)
router.use("/admin" , adminRouter)



