import { prisma } from "../db/prisma.js";

export async function ownerDashboard(req, res, next) {
  try {
    const store = await prisma.store.findUnique({
      where: { ownerId: req.user.id },
      include: {
        ratings: {
          include: { user: { select: { id: true, name: true, email: true } } }
        }
      }
    });

    if (!store) return res.status(404).json({ message: "No store linked to this owner" });

    const avg =
      store.ratings.length === 0
        ? null
        : store.ratings.reduce((a, r) => a + r.value, 0) / store.ratings.length;

    const raters = store.ratings.map((r) => ({
      userId: r.user.id,
      name: r.user.name,
      email: r.user.email,
      rating: r.value,
      updatedAt: r.updatedAt
    }));

    res.json({
      store: { id: store.id, name: store.name, address: store.address },
      averageRating: avg ? Number(avg.toFixed(2)) : null,
      raters
    });
  } catch (e) {
    next(e);
  }
}
