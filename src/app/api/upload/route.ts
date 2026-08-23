import { uploadImageToCloudinary } from "@/src/backend/utils/cloudinary";
import { NextResponse } from "next/server";

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const { image } = body; // Espera un string base64 o URL data-image

    if (!image) {
      return NextResponse.json(
        { error: 'No se proporcionó ningún archivo de imagen' },
        { status: 400 }
      );
    }

    const { url, public_id } = await uploadImageToCloudinary(image);

    return NextResponse.json(
      { success: true, url, public_id },
      { status: 200 }
    );
  } catch (error: unknown) {
    const message = error instanceof Error ? error.message : 'Error desconocido';
    return NextResponse.json(
      { error: message },
      { status: 500 }
    );
  }
}