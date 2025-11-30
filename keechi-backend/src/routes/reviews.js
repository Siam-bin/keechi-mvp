// reviews.js - Routes for shop reviews
import express from "express";
import { PrismaClient } from "@prisma/client";
import { authMiddleware, roleMiddleware } from "../utils/auth.js";

const router = express.Router();
const prisma = new PrismaClient();

// GET /api/reviews?shopId=1 - Get reviews for a shop
router.get("/", async (req, res) => {
  try {
    const { shopId } = req.query;

    if (!shopId) {
      return res.status(400).json({ error: "shopId is required" });
    }

    const reviews = await prisma.review.findMany({
      where: { shopId: parseInt(shopId) },
      include: {
        user: { select: { name: true, email: true } },
        teamMember: { select: { name: true, role: true } }
      },
      orderBy: { createdAt: "desc" },
    });

    // Calculate average rating
    const avgRating =
      reviews.length > 0
        ? (reviews.reduce((sum, r) => sum + r.rating, 0) / reviews.length).toFixed(1)
        : 0;

    res.json({
      reviews,
      averageRating: parseFloat(avgRating),
      totalReviews: reviews.length,
      ratingDistribution: calculateRatingDistribution(reviews),
    });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// POST /api/reviews - Create a review (user must have completed appointment)
router.post("/", authMiddleware, roleMiddleware(["user"]), async (req, res) => {
  try {
    const { shopId, rating, title, text, teamMemberId } = req.body;

    if (!shopId || !rating || !text) {
      return res.status(400).json({ error: "Missing required fields" });
    }

    if (rating < 1 || rating > 5) {
      return res.status(400).json({ error: "Rating must be between 1 and 5" });
    }

    // Check if user has completed appointment at this shop
    const completedAppointment = await prisma.appointment.findFirst({
      where: {
        userId: req.user.id,
        shopId: parseInt(shopId),
        status: "Completed",
      },
    });

    if (!completedAppointment) {
      return res.status(403).json({
        error: "You can only review shops where you've completed an appointment",
      });
    }

    // Check if user already has a review for this shop
    const existingReview = await prisma.review.findUnique({
      where: {
        userId_shopId: {
          userId: req.user.id,
          shopId: parseInt(shopId),
        },
      },
    });

    if (existingReview) {
      // Update existing review
      const updated = await prisma.review.update({
        where: { id: existingReview.id },
        data: {
          rating,
          title,
          text,
          teamMemberId: teamMemberId ? parseInt(teamMemberId) : existingReview.teamMemberId
        },
        include: { user: { select: { name: true } } },
      });
      return res.json(updated);
    }

    // Create new review
    const review = await prisma.review.create({
      data: {
        userId: req.user.id,
        shopId: parseInt(shopId),
        rating,
        title,
        text,
        teamMemberId: teamMemberId ? parseInt(teamMemberId) : null,
      },
      include: { user: { select: { name: true } } },
    });

    // Update shop's average rating
    await updateShopRating(parseInt(shopId));

    res.status(201).json(review);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// DELETE /api/reviews/:id - Delete own review
router.delete("/:id", authMiddleware, async (req, res) => {
  try {
    const review = await prisma.review.findUnique({
      where: { id: parseInt(req.params.id) },
    });

    if (!review) {
      return res.status(404).json({ error: "Review not found" });
    }

    if (review.userId !== req.user.id) {
      return res.status(403).json({ error: "Unauthorized" });
    }

    const shopId = review.shopId;

    await prisma.review.delete({
      where: { id: parseInt(req.params.id) },
    });

    // Update shop rating
    await updateShopRating(shopId);

    res.json({ message: "Review deleted successfully" });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// Helper function to update shop rating
async function updateShopRating(shopId) {
  try {
    const reviews = await prisma.review.findMany({
      where: { shopId },
    });

    const avgRating =
      reviews.length > 0
        ? reviews.reduce((sum, r) => sum + r.rating, 0) / reviews.length
        : 0;

    await prisma.shop.update({
      where: { id: shopId },
      data: {
        rating: parseFloat(avgRating.toFixed(1)),
        reviewCount: reviews.length,
      },
    });
  } catch (error) {
    console.error("Error updating shop rating:", error);
  }
}

// Helper function to calculate rating distribution
function calculateRatingDistribution(reviews) {
  const distribution = { 5: 0, 4: 0, 3: 0, 2: 0, 1: 0 };

  reviews.forEach((review) => {
    if (review.rating >= 1 && review.rating <= 5) {
      distribution[review.rating]++;
    }
  });

  return distribution;
}

export default router;
