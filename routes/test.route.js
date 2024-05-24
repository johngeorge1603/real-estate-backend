import express from "express";
import { verifyToken } from "../middleware/tokenVerify.js";
import { shouldBeLoggedIn } from "../controllers/test.controller.js";


const router = express.Router();

router.get("/should-be-logged-in" , verifyToken, shouldBeLoggedIn)
// router.get("/should-be-admin" , shouldBeAdmin)

export default router;