import express from "express";
import * as teamMemberController from "../controllers/teamMemberController.js";
import { authMiddleware, roleMiddleware } from "../utils/auth.js";

const router = express.Router();

// Public routes
router.get("/shop/:shopId", teamMemberController.getShopTeamMembers);

// Protected routes (Shop Owner only)
router.post("/", authMiddleware, roleMiddleware(["shopOwner"]), teamMemberController.createTeamMember);
router.get("/my-team", authMiddleware, roleMiddleware(["shopOwner"]), teamMemberController.getMyTeamMembers);
router.patch("/:id", authMiddleware, roleMiddleware(["shopOwner"]), teamMemberController.updateTeamMember);
router.delete("/:id", authMiddleware, roleMiddleware(["shopOwner"]), teamMemberController.deleteTeamMember);

export default router;
