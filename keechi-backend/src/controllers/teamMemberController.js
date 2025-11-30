import { PrismaClient } from "@prisma/client";
const prisma = new PrismaClient();

// Helper to get shop by owner
const getShopByOwner = async (userId) => {
    return await prisma.shop.findUnique({
        where: { ownerId: userId },
    });
};

// Create a new team member
export const createTeamMember = async (req, res) => {
    try {
        const { name, role, bio, specialties, imageUrl } = req.body;

        const shop = await getShopByOwner(req.user.id);
        if (!shop) {
            return res.status(404).json({ error: "Shop not found" });
        }

        const teamMember = await prisma.teamMember.create({
            data: {
                shopId: shop.id,
                name,
                role,
                bio,
                specialties: specialties || [],
                imageUrl,
            },
        });

        res.status(201).json(teamMember);
    } catch (error) {
        console.error("Error creating team member:", error);
        res.status(500).json({ error: "Failed to create team member" });
    }
};

// Get all team members for the authenticated shop owner
export const getMyTeamMembers = async (req, res) => {
    try {
        const shop = await getShopByOwner(req.user.id);
        if (!shop) {
            return res.status(404).json({ error: "Shop not found" });
        }

        const teamMembers = await prisma.teamMember.findMany({
            where: { shopId: shop.id },
            orderBy: { createdAt: "desc" },
        });

        res.json(teamMembers);
    } catch (error) {
        console.error("Error fetching team members:", error);
        res.status(500).json({ error: "Failed to fetch team members" });
    }
};

// Get team members for a specific shop (public)
export const getShopTeamMembers = async (req, res) => {
    try {
        const { shopId } = req.params;

        const teamMembers = await prisma.teamMember.findMany({
            where: {
                shopId: parseInt(shopId),
                isActive: true
            },
            select: {
                id: true,
                name: true,
                role: true,
                bio: true,
                imageUrl: true,
                specialties: true,
            }
        });

        res.json(teamMembers);
    } catch (error) {
        console.error("Error fetching shop team members:", error);
        res.status(500).json({ error: "Failed to fetch team members" });
    }
};

// Update a team member
export const updateTeamMember = async (req, res) => {
    try {
        const { id } = req.params;
        const { name, role, bio, specialties, imageUrl, isActive } = req.body;

        const shop = await getShopByOwner(req.user.id);
        if (!shop) {
            return res.status(404).json({ error: "Shop not found" });
        }

        // Verify ownership
        const existingMember = await prisma.teamMember.findUnique({
            where: { id: parseInt(id) },
        });

        if (!existingMember || existingMember.shopId !== shop.id) {
            return res.status(403).json({ error: "Not authorized to update this team member" });
        }

        const updatedMember = await prisma.teamMember.update({
            where: { id: parseInt(id) },
            data: {
                name,
                role,
                bio,
                specialties,
                imageUrl,
                isActive,
            },
        });

        res.json(updatedMember);
    } catch (error) {
        console.error("Error updating team member:", error);
        res.status(500).json({ error: "Failed to update team member" });
    }
};

// Delete a team member
export const deleteTeamMember = async (req, res) => {
    try {
        const { id } = req.params;

        const shop = await getShopByOwner(req.user.id);
        if (!shop) {
            return res.status(404).json({ error: "Shop not found" });
        }

        // Verify ownership
        const existingMember = await prisma.teamMember.findUnique({
            where: { id: parseInt(id) },
        });

        if (!existingMember || existingMember.shopId !== shop.id) {
            return res.status(403).json({ error: "Not authorized to delete this team member" });
        }

        await prisma.teamMember.delete({
            where: { id: parseInt(id) },
        });

        res.json({ message: "Team member deleted successfully" });
    } catch (error) {
        console.error("Error deleting team member:", error);
        res.status(500).json({ error: "Failed to delete team member" });
    }
};
