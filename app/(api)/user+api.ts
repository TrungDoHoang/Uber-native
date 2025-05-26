import { neon } from "@neondatabase/serverless";

const sql = neon(process.env.EXPO_PUBLIC_DATABASE_URL || "");

export async function POST(req: Request) {
  try {
    const { name, email, clerkId } = await req.json();
    if (!name || !email || !clerkId) {
      return Response.json(
        {
          message: "Missing required field",
        },
        { status: 400 }
      );
    }
    const response =
      await sql`INSERT INTO users (name, email, clerk_id) VALUES (${name},${email},${clerkId})`;
    return Response.json({ data: response }, { status: 201 });
  } catch (error) {
    console.log(error);
    return Response.json({ error }, { status: 500 });
  }
}

export async function GET(request: Request) {
  const response = await sql`SELECT * FROM users`;
  return Response.json({ data: response }, { status: 200 });
}
