import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import Stripe from "stripe";
import nodemailer from "nodemailer";

const stripe = new Stripe(process.env.STRIPE_SECRET_KEY!, {
  apiVersion: "2025-02-24.acacia" as any,
});

const transporter = nodemailer.createTransport({
  service: "gmail",
  auth: {
    user: process.env.EMAIL_USER,
    pass: process.env.EMAIL_PASS,
  },
});

export async function POST(req: Request) {
  try {
    const body = await req.json();
    const {
      customerName, customerEmail, customerPhone, address, city,
      postalCode, paymentMethod, notes, items, totalAmount, userId,
    } = body;

    if (!items || items.length === 0) {
      return NextResponse.json({ success: false, error: "Cart is empty." }, { status: 400 });
    }

    // Case-insensitive check for Stripe payment method
    const isStripe = paymentMethod?.toLowerCase() === "stripe";

    const order = await prisma.order.create({
      data: {
        userId: userId || null,
        customerName, customerEmail, customerPhone, address, city,
        postalCode, paymentMethod: paymentMethod || "COD", notes,
        totalAmount: Number(totalAmount),
        status: "Pending", // Order fulfillment status (Admin baad mein change kar sakega)
        paymentStatus: isStripe ? "Paid" : "Pending", // Stripe ke liye "Paid", COD ke liye "Pending"
        items: {
          create: items.map((item: any) => ({
            productId: item.id ? String(item.id) : null,
            title: item.name || item.title,
            price: Number(item.price),
            quantity: Number(item.quantity),
            image: item.image || null,
            size: item.size,
            color: item.color,
          })),
        },
      },
    });

    if (customerEmail) {
      try {
        const siteUrl = process.env.NEXT_PUBLIC_BASE_URL || "http://localhost:3000";

        await transporter.sendMail({
          from: `"Aetherfield Store" <${process.env.EMAIL_USER}>`,
          to: customerEmail,
          subject: `Order Confirmation - #${order.id.slice(-6)}`,
          html: `
            <div style="font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif; max-width: 600px; margin: auto; padding: 30px; background-color: #f9f9f9; border-radius: 16px; border: 1px solid #eaeaea;">
              
              <div style="text-align: center; border-bottom: 2px solid #000; padding-bottom: 20px; margin-bottom: 25px;">
                <h1 style="color: #000; margin: 0; font-size: 24px; font-weight: 900; letter-spacing: -0.5px;">AETHERFIELD</h1>
                <p style="color: #666; font-size: 14px; margin-top: 5px;">Order Confirmation & Receipt</p>
              </div>

              <h2 style="color: #111; font-size: 20px;">Thank you for your order, ${customerName}!</h2>
              <p style="color: #555; font-size: 14px; line-height: 1.5;">Your order has been placed successfully and is currently being processed. Here are the details of your purchase:</p>
              
              <h3 style="border-bottom: 1px solid #ddd; padding-bottom: 8px; margin-top: 25px; font-size: 16px; color: #333;">Order Summary</h3>
              
              <table style="width: 100%; border-collapse: collapse; background: #fff; border-radius: 12px; overflow: hidden; box-shadow: 0 2px 4px rgba(0,0,0,0.02);">
                ${items.map((item: any) => {
                  const rawImage = item.image || "";
                  const imageUrl = rawImage.startsWith("http")
                    ? rawImage
                    : `${siteUrl}${rawImage.startsWith("/") ? "" : "/"}${rawImage}`;

                  return `
                  <tr>
                    <td style="padding: 15px; border-bottom: 1px solid #f0f0f0; width: 70px; vertical-align: middle;">
                      <img src="${imageUrl}" width="60" height="60" style="object-fit: cover; border-radius: 8px; display: block; background: #eee;" />
                    </td>
                    <td style="padding: 15px; border-bottom: 1px solid #f0f0f0; vertical-align: middle;">
                      <strong style="font-size: 15px; color: #111; display: block; margin-bottom: 4px;">${item.name || item.title}</strong>
                      <span style="font-size: 13px; color: #666;">Qty: ${item.quantity} ${item.size ? `&bull; Size: ${item.size}` : ''} ${item.color ? `&bull; Color: <span style="display:inline-block;width:10px;height:10px;background:${item.color};border-radius:50%;vertical-align:middle;"></span>` : ''}</span>
                    </td>
                    <td style="padding: 15px; border-bottom: 1px solid #f0f0f0; text-align: right; font-weight: bold; font-size: 15px; color: #111; vertical-align: middle;">
                      $${(Number(item.price) * Number(item.quantity)).toFixed(2)}
                    </td>
                  </tr>
                `;
                }).join('')}
              </table>

              <div style="margin-top: 20px; background: #000; color: #fff; padding: 15px 20px; border-radius: 12px; display: flex; justify-content: space-between; align-items: center;">
                <span style="font-size: 15px; font-weight: bold;">Total Amount:</span>
                <span style="font-size: 18px; font-weight: 900;">$${Number(totalAmount).toFixed(2)}</span>
              </div>

              <div style="margin-top: 25px; background: #fff; padding: 15px; border-radius: 12px; border: 1px solid #eee;">
                <h4 style="margin: 0 0 8px 0; font-size: 14px; color: #333;">Shipping Address:</h4>
                <p style="margin: 0; font-size: 13px; color: #666; line-height: 1.4;">${address}, ${city} ${postalCode || ''}</p>
                <p style="margin: 5px 0 0 0; font-size: 13px; color: #666;">Payment Method: <strong>${paymentMethod}</strong></p>
                <p style="margin: 5px 0 0 0; font-size: 13px; color: #666;">Payment Status: <strong>${isStripe ? "Paid" : "Pending"}</strong></p>
              </div>

              <p style="font-size: 12px; color: #888; margin-top: 30px; text-align: center; line-height: 1.4;">
                If you have any questions, feel free to reply to this email.<br/>&copy; 2026 Aetherfield. All rights reserved.
              </p>
            </div>
          `,
        });
        console.log("Order confirmation email sent successfully to:", customerEmail);
      } catch (emailError) {
        console.error("Nodemailer Email sending failed:", emailError);
      }
    }

    if (isStripe) {
      const stripeSession = await stripe.checkout.sessions.create({
        payment_method_types: ["card"],
        line_items: items.map((item: any) => ({
          price_data: {
            currency: "usd",
            product_data: { name: item.name || item.title, images: [item.image] },
            unit_amount: Math.round(Number(item.price) * 100),
          },
          quantity: Number(item.quantity),
        })),
        mode: "payment",
        success_url: `${process.env.NEXT_PUBLIC_BASE_URL}/success?order_id=${order.id}`,
        cancel_url: `${process.env.NEXT_PUBLIC_BASE_URL}/cart?canceled=true`,
      });
      return NextResponse.json({ success: true, url: stripeSession.url, order }, { status: 201 });
    }

    return NextResponse.json({ success: true, order }, { status: 201 });
  } catch (error: any) {
    console.error("Checkout API Error:", error);
    return NextResponse.json({ success: false, error: error.message }, { status: 500 });
  }
}