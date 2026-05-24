import jwt from "jsonwebtoken";

export async function getUserFromToken(req: Request) {
  const authHeader = req.headers.get("authorization");

  if (!authHeader?.startsWith("Bearer ")) {
    return null;
  }

  const token = authHeader.split(" ")[1];

  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET!);

    return decoded as { id: string; email: string; role: string };
  } catch {
    return null;
  }
}
