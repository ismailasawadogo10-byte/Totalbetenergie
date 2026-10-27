import prisma from "@/lib/prisma";
import { ensureSeedData } from "@/lib/auth";

async function main() {
  await ensureSeedData();
  console.log("Seed initialized successfully.");
}

main().catch((error) => {
  console.error(error);
  process.exit(1);
});
