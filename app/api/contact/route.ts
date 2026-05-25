import { NextResponse } from "next/server";
import { z } from "zod";
import { prisma } from "@/lib/prisma";
import { Resend } from "resend";
import { env } from "@/lib/env";

const resend = new Resend(env.RESEND_API_KEY);

const schema = z.object({
  name: z.string().min(1, "Name is required"),
  email: z.string().email("Invalid email address"),
  phone: z.string().optional(),
  weddingDate: z.string().optional(),
  venue: z.string().optional(),
  message: z.string().min(20, "Message must be at least 20 characters"),
});

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const parsed = schema.safeParse(body);

    if (!parsed.success) {
      return NextResponse.json(
        { error: parsed.error.issues[0].message },
        { status: 400 }
      );
    }

    const { name, email, phone, weddingDate, venue, message } = parsed.data;

    await prisma.inquiry.create({
      data: {
        name,
        email,
        phone,
        weddingDate: weddingDate ? new Date(weddingDate) : null,
        venue,
        message,
      },
    });

    await resend.emails.send({
      from: "noreply@caraweis.com",
      to: env.ADMIN_EMAIL,
      subject: `New Inquiry from ${name}`,
      html: `
        <h2 style="font-family:serif;font-weight:300;">New Wedding Inquiry</h2>
        <p><strong>Name:</strong> ${name}</p>
        <p><strong>Email:</strong> ${email}</p>
        ${phone ? `<p><strong>Phone:</strong> ${phone}</p>` : ""}
        ${weddingDate ? `<p><strong>Wedding Date:</strong> ${new Date(weddingDate).toLocaleDateString("en-US", { year: "numeric", month: "long", day: "numeric" })}</p>` : ""}
        ${venue ? `<p><strong>Venue:</strong> ${venue}</p>` : ""}
        <p><strong>Message:</strong></p>
        <p style="white-space:pre-wrap;">${message}</p>
      `,
    });

    return NextResponse.json({ success: true });
  } catch {
    return NextResponse.json(
      { error: "Something went wrong. Please try again." },
      { status: 500 }
    );
  }
}
