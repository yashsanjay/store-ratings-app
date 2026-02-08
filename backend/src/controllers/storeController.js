import { prisma } from "../db/prisma.js";
import { listStoresSchema } from "../validators/store.js";
import { upsertRatingSchema } from "../validators/rating.js";
import { containsInsensitive, parseSort } from "../utils/query.js";

export async function listStores(req, res, next) {
  try {
    const q = listStoresSchema.parse(req.query);
    const { by, order } = parseSort(q.sortBy, q.sortOrder, ["name", "address", "createdAt"]);

    const stores = await prisma.store.findMany({
      where: q.q
        ? {
            OR: [
              { name: containsInsensitive(q.q) },
              { address: containsInsensitive(q.q) }
            ]
          }
        : undefined,
      orderBy: { [by]: order },
      include: {
        ratings: { select: { value: true, userId: true } }
      }
    });

    const userId = req.user?.id;

    const mapped = stores.map((s) => {
      const avg =
        s.ratings.length === 0 ? null : s.ratings.reduce((a, r) => a + r.value, 0) / s.ratings.length;

      const my = userId ? s.ratings.find((r) => r.userId === userId) : null;

      return {
        id: s.id,
        name: s.name,
        address: s.address,
        overallRating: avg ? Number(avg.toFixed(2)) : null,
        myRating: my ? my.value : null
      };
    });

    res.json({ stores: mapped });
  } catch (e) {
    next(e);
  }
}

export async function upsertMyRating(req, res, next) {
  try {
    const { storeId } = req.params;
    const body = upsertRatingSchema.parse(req.body);

    const store = await prisma.store.findUnique({ where: { id: storeId } });
    if (!store) return res.status(404).json({ message: "Store not found" });

    const rating = await prisma.rating.upsert({
      where: { userId_storeId: { userId: req.user.id, storeId } },
      update: { value: body.value },
      create: { userId: req.user.id, storeId, value: body.value }
    });

    res.json({ rating });
  } catch (e) {
    next(e);
  }
}
