import { Resend } from "resend"
import { NextResponse } from "next/server"

const resend = new Resend(process.env.RESEND_API_KEY)

export async function POST(request: Request) {
  try {
    const body = await request.json()
    const { name, email, feedbackType, message } = body

    if (!name || !email || !feedbackType || !message) {
      return NextResponse.json(
        { error: "All fields are required" },
        { status: 400 }
      )
    }

    await resend.emails.send({
      from: "QuickHands Feedback <onboarding@resend.dev>",
      to: "noirsfera@gmail.com",
      subject: `[QuickHands Feedback] ${feedbackType} — from ${name}`,
      html: `
        <div style="font-family: sans-serif; max-width: 600px; margin: 0 auto;">
          <h2 style="color: #111827;">New Feedback Received</h2>
          <hr style="border: none; border-top: 1px solid #e5e7eb;" />
          <p><strong>Name:</strong> ${name}</p>
          <p><strong>Email:</strong> ${email}</p>
          <p><strong>Type:</strong> ${feedbackType}</p>
          <h3 style="color: #111827; margin-top: 24px;">Message</h3>
          <p style="color: #374151; white-space: pre-wrap;">${message}</p>
          <hr style="border: none; border-top: 1px solid #e5e7eb; margin-top: 32px;" />
          <p style="color: #9ca3af; font-size: 12px;">Sent from QuickHands feedback form</p>
        </div>
      `,
    })

    return NextResponse.json({ success: true })
  } catch (error) {
    console.error("Feedback email error:", error)
    return NextResponse.json(
      { error: "Failed to send feedback" },
      { status: 500 }
    )
  }
}
