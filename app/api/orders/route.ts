import { NextResponse } from "next/server";
import { createOrder } from "@/lib/order-service";

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const result = await createOrder(body);
    return NextResponse.json({ orderCode: result.order.code, whatsappUrl: result.whatsappUrl });
  } catch (error) {
    return NextResponse.json(
      { error: error instanceof Error ? error.message : "Could not save order." },
      { status: 400 }
    );
  }
}
