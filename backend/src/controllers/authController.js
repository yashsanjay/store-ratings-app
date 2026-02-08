import { prisma } from "../db/prisma.js";
import { registerSchema, loginSchema, changePasswordSchema } from "../validators/auth.js";
import { hashPassword, verifyPassword } from "../utils/password.js";
import { signToken } from "../utils/jwt.js";

export async function register(req, res, next) {
  try {
    const body = registerSchema.parse(req.body);

    const exists = await prisma.user.findUnique({ where: { email: body.email } });
    if (exists) return res.status(409).json({ message: "Email already registered" });

    const passwordHash = await hashPassword(body.password);

    const user = await prisma.user.create({
      data: {
        name: body.name,
        email: body.email,
        address: body.address,
        passwordHash,
        role: "NORMAL_USER"
      },
      select: { id: true, email: true, role: true, name: true }
    });

    const token = signToken({ id: user.id, email: user.email, role: user.role });
    res.status(201).json({ token, user });
  } catch (e) {
    next(e);
  }
}

export async function login(req, res, next) {
  try {
    const body = loginSchema.parse(req.body);

    const user = await prisma.user.findUnique({ where: { email: body.email } });
    if (!user) return res.status(401).json({ message: "Invalid credentials" });

    const ok = await verifyPassword(body.password, user.passwordHash);
    if (!ok) return res.status(401).json({ message: "Invalid credentials" });

    const token = signToken({ id: user.id, email: user.email, role: user.role });
    res.json({
      token,
      user: { id: user.id, email: user.email, role: user.role, name: user.name }
    });
  } catch (e) {
    next(e);
  }
}

export async function me(req, res, next) {
  try {
    const u = await prisma.user.findUnique({
      where: { id: req.user.id },
      select: { id: true, name: true, email: true, address: true, role: true }
    });
    res.json({ user: u });
  } catch (e) {
    next(e);
  }
}

export async function changePassword(req, res, next) {
  try {
    const body = changePasswordSchema.parse(req.body);

    const user = await prisma.user.findUnique({ where: { id: req.user.id } });
    if (!user) return res.status(404).json({ message: "User not found" });

    const ok = await verifyPassword(body.currentPassword, user.passwordHash);
    if (!ok) return res.status(400).json({ message: "Current password is wrong" });

    const passwordHash = await hashPassword(body.newPassword);
    await prisma.user.update({ where: { id: user.id }, data: { passwordHash } });

    res.json({ message: "Password updated" });
  } catch (e) {
    next(e);
  }
}
