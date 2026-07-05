import { NextResponse } from "next/server";
import { spec } from "../../../../backend/config/swagger";

export async function GET() {
  return NextResponse.json(spec);
}