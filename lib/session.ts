import { auth } from "@/lib/auth";
import { type Session } from "next-auth";

export async function getServerSession(): Promise<Session | null> {
  return auth();
}
