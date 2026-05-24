import { NextResponse } from "next/server";

import mongoose from "mongoose";

import { connectDB } from "@/lib/db";

import { requireRole } from "@/lib/requireRole";

import Category from "@/models/Category";

export async function PATCH(
  req: Request,
  context: {
    params: Promise<{
      id: string;
    }>;
  },
) {
  try {
    await connectDB();

    const { id } = await context.params;

    const auth = await requireRole(req, ["Admin", "Editor"]);

    if (auth.error) {
      return auth.error;
    }

    if (!mongoose.Types.ObjectId.isValid(id)) {
      return NextResponse.json(
        {
          message: "Invalid category id",
        },
        {
          status: 400,
        },
      );
    }

    const body = await req.json();

    const {
      name,
      slug,
    }: {
      name?: string;
      slug?: string;
    } = body;

    const category = await Category.findByIdAndUpdate(
      id,
      {
        ...(name && {
          name,
        }),

        ...(slug && {
          slug,
        }),
      },
      {
        returnDocument: "after",
      },
    );

    if (!category) {
      return NextResponse.json(
        {
          message: "Category not found",
        },
        {
          status: 404,
        },
      );
    }

    return NextResponse.json(category);
  } catch (error) {
    console.error(error);

    return NextResponse.json(
      {
        message: "Failed to update category",
      },
      {
        status: 500,
      },
    );
  }
}

export async function DELETE(
  req: Request,
  context: {
    params: Promise<{
      id: string;
    }>;
  },
) {
  try {
    await connectDB();

    const { id } = await context.params;

    const auth = await requireRole(req, ["Admin"]);

    if (auth.error) {
      return auth.error;
    }

    if (!mongoose.Types.ObjectId.isValid(id)) {
      return NextResponse.json(
        {
          message: "Invalid category id",
        },
        {
          status: 400,
        },
      );
    }

    const category = await Category.findByIdAndDelete(id);

    if (!category) {
      return NextResponse.json(
        {
          message: "Category not found",
        },
        {
          status: 404,
        },
      );
    }

    return NextResponse.json({
      message: "Category deleted successfully",
    });
  } catch (error) {
    console.error(error);

    return NextResponse.json(
      {
        message: "Failed to delete category",
      },
      {
        status: 500,
      },
    );
  }
}
