import { neon } from "@neondatabase/serverless"
import { NextResponse } from "next/server"

const sql = neon(process.env.DATABASE_URL!)

export async function POST(request: Request) {
  try {
    const body = await request.json()
    const { firstName, lastName, email, phone, profession, relevantInfo } = body

    // Validate required fields
    if (!firstName || !lastName || !email || !phone || !profession || !relevantInfo) {
      return NextResponse.json({ error: "All fields are required" }, { status: 400 })
    }

    // Insert user into database
    const result = await sql`
      INSERT INTO users (first_name, last_name, email, phone, profession, relevant_info, created_at)
      VALUES (${firstName}, ${lastName}, ${email}, ${phone}, ${profession}, ${relevantInfo}, NOW())
      RETURNING id, first_name, last_name, email, phone, profession, relevant_info
    `

    return NextResponse.json({
      success: true,
      user: result[0],
    })
  } catch (error) {
    console.error("[v0] Onboarding error:", error)
    return NextResponse.json({ error: "Failed to create user profile" }, { status: 500 })
  }
}

export async function GET() {
  try {
    const result = await sql`SELECT COUNT(*) as count FROM users`
    return NextResponse.json({ count: parseInt(result[0].count) })
  } catch (error) {
    return NextResponse.json({ error: "Failed to fetch count" }, { status: 500 })
  }
}
