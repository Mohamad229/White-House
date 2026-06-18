import { NextResponse } from "next/server";
import { ZodError } from "zod";
import { createOrder } from "@/lib/order-service";

const safeOrderErrors = new Set([
  "Product is not available.",
  "Selected color is not available.",
  "Selected size is not available.",
  "Enter a valid WhatsApp phone number.",
]);

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const result = await createOrder(body);
    return NextResponse.json({
      orderCode: result.order.code,
      whatsappUrl: result.whatsappUrl,
    });
  } catch (error) {
    const message =
      error instanceof ZodError
        ? "Check the required order fields and try again."
        : error instanceof Error && safeOrderErrors.has(error.message)
          ? error.message
          : "Could not save order.";
    return NextResponse.json(
      {
        error: message,
      },
      { status: 400 },
    );
  }
}
