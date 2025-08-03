import { NextResponse } from "next/server";
import turkiye from "../turkiye.json";

export async function GET(): Promise<NextResponse> {
  return NextResponse.json(turkiyeJSON);
}

const turkiyeJSON = turkiye;
