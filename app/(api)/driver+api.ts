import { neon } from "@neondatabase/serverless";

const sql = neon(process.env.EXPO_PUBLIC_DATABASE_URL || "");

export async function GET() {
  try {
    const response = await sql`SELECT * FROM drivers`;
    return Response.json({ data: response }, { status: 200 });
  } catch (error) {
    return Response.json({ error }, { status: 500 });
  }
}
