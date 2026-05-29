import { NextResponse } from "next/server";
import cloudinary from "@/lib/cloudinary";

export async function POST(req: Request) {
  try {
    const { publicId } = await req.json();

    if (!publicId) {
      return NextResponse.json(
        { message: "Missing publicId" },
        { status: 400 },
      );
    }

    await cloudinary.uploader.destroy(publicId);

    return NextResponse.json({
      success: true,
    });
  } catch (error) {
    console.error(error);

    return NextResponse.json({ message: "Delete failed" }, { status: 500 });
  }
}
