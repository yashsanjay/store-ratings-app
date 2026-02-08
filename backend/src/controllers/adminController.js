import { prisma } from "../db/prisma.js";
import { createUserSchema, createStoreSchema, listFiltersSchema } from "../validators/admin.js";
import { hashPassword } from "../utils/password.js";
import { containsInsensitive, parseSort } from "../utils/query.js";

export async function dashboard(req, res, next) {
  try {
    const [users, stores, ratings] = await Promise.all([
      prisma.user.count(),
      prisma.store.count(),
      prisma.rating.count()
    ]);
    res.json({ users, stores, ratings });
  } catch (e) {
    next(e);
  }
}

export async function createUser(req, res, next) {
  try {
    const body = createUserSchema.parse(req.body);

    const exists = await prisma.user.findUnique({ where: { email: body.email } });
    if (exists) return res.status(409).json({ message: "Email already exists" });

    const passwordHash = await hashPassword(body.password);
    const user = await prisma.user.create({
      data: {
        name: body.name,
        email: body.email,
        address: body.address,
        passwordHash,
        role: body.role
      },
      select: { id: true, name: true, email: true, address: true, role: true }
    });

    res.status(201).json({ user });
  } catch (e) {
    next(e);
  }
}

export async function createStore(req, res, next) {
  try {
    const body = createStoreSchema.parse(req.body);

    if (body.ownerId) {
      const owner = await prisma.user.findUnique({ where: { id: body.ownerId } });
      if (!owner || owner.role !== "STORE_OWNER") {
        return res.status(400).json({ message: "ownerId must belong to a STORE_OWNER" });
      }
    }

    const store = await prisma.store.create({
      data: {
        name: body.name,
        email: body.email,
        address: body.address,
        ownerId: body.ownerId || null
      }
    });

    res.status(201).json({ store });
  } catch (e) {
    next(e);
  }
}

export async function listUsers(req, res, next) {
  try {
    const q = listFiltersSchema.parse(req.query);

    const { by, order } = parseSort(q.sortBy, q.sortOrder, ["name", "email", "address", "role", "createdAt"]);

    const users = await prisma.user.findMany({
      where: {
        name: containsInsensitive(q.name),
        email: containsInsensitive(q.email),
        address: containsInsensitive(q.address),
        role: q.role
      },
      orderBy: { [by]: order },
      select: { id: true, name: true, email: true, address: true, role: true, createdAt: true }
    });

    res.json({ users });
  } catch (e) {
    next(e);
  }
}

export async function listStores(req, res, next) {
  try {
    const q = listFiltersSchema.parse(req.query);
    const { by, order } = parseSort(q.sortBy, q.sortOrder, ["name", "email", "address", "createdAt"]);

    const stores = await prisma.store.findMany({
      where: {
        name: containsInsensitive(q.name),
        email: containsInsensitive(q.email),
        address: containsInsensitive(q.address)
      },
      orderBy: { [by]: order },
      include: {
        ratings: { select: { value: true } }
      }
    });

    const mapped = stores.map((s) => {
      const avg =
        s.ratings.length === 0 ? null : s.ratings.reduce((a, r) => a + r.value, 0) / s.ratings.length;
      return {
        id: s.id,
        name: s.name,
        email: s.email,
        address: s.address,
        rating: avg ? Number(avg.toFixed(2)) : null
      };
    });

    res.json({ stores: mapped });
  } catch (e) {
    next(e);
  }
}

export async function userDetails(req, res, next) {
  try {
    const { id } = req.params;

    const user = await prisma.user.findUnique({
      where: { id },
      select: { id: true, name: true, email: true, address: true, role: true }
    });
    if (!user) return res.status(404).json({ message: "User not found" });

    let ownerRating = null;
    if (user.role === "STORE_OWNER") {
      const store = await prisma.store.findUnique({
        where: { ownerId: user.id },
        include: { ratings: { select: { value: true } } }
      });
      if (store) {
        const avg =
          store.ratings.length === 0 ? null : store.ratings.reduce((a, r) => a + r.value, 0) / store.ratings.length;
        ownerRating = avg ? Number(avg.toFixed(2)) : null;
      }
    }

    res.json({ user, ownerRating });
  } catch (e) {
    next(e);
  }
}
