import { Router } from "express";
import { UpdateMetadataSchema } from "../../types";
import { userMiddleware } from "../../middleware/user";
import client from "@repo/db/client";

export const userRouter = Router();

userRouter.post("/metadata", userMiddleware , async (req,res) => {

 const parsedData = UpdateMetadataSchema.safeParse(req.body)

 if(!parsedData.success) {
  res.status(400).json({message: "Validation Failed"})
  return
 }

 await client.user.update({
  where: {
   id: req.userId
  },
  data: {
   avatarId: parsedData.data.avatarId
  }
 })

 res.json({message: "Metadata updated"})

})

userRouter.get("metadata/bulk", (req,res) => {

 const userIdString = (req.query.userIds ?? "[]") as string;

 const userIds = (userIdString).slice(1, userIdString?.length - 2).split(",")

 const metadata = client.user.findMany({
  where: {
   id: {
    in: userIds
   }
  }, select: {
       avatar: true
  }
 })
 
 console.log(typeof userIds);

 console.log(userIds)

} )