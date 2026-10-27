import { cookies } from "next/headers";
import { redirect } from "next/navigation";
import prisma from "@/lib/prisma";

export async function getCurrentUser() {
  const sessionId = cookies().get("session_user_id")?.value;
  if (!sessionId) return null;

  return prisma.user.findUnique({
    where: { id: sessionId },
    include: {
      investments: {
        include: {
          product: true,
        },
      },
      deposits: true,
      withdrawals: true,
      notifications: {
        orderBy: { createdAt: "desc" },
      },
    },
  });
}

export async function requireUser() {
  const user = await getCurrentUser();
  if (!user) redirect("/login");
  return user;
}

export async function requireAdmin() {
  const user = await requireUser();
  if (user.role !== "ADMIN") redirect("/dashboard");
  return user;
}
