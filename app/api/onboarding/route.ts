import { neon } from "@neondatabase/serverless"
import { NextResponse } from "next/server"

const databaseUrl = process.env.DATABASE_URL

if (!databaseUrl) {
  throw new Error("Missing DATABASE_URL")
}

const sql = neon(databaseUrl)

export async function POST(request: Request) {
  try {
    const body = await request.json()

    const clean = (v: string) => v.trim()

    const { firstName, lastName, email, phone, profession, relevantInfo } = {
      firstName: clean(body.firstName),
      lastName: clean(body.lastName),
      email: clean(body.email),
      phone: clean(body.phone),
      profession: clean(body.profession),
      relevantInfo: clean(body.relevantInfo),
    }

    if (!firstName || !lastName || !email || !phone || !profession || !relevantInfo) {
      return NextResponse.json({ error: "All fields are required" }, { status: 400 })
    }

    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/
    if (!emailRegex.test(email)) {
      return NextResponse.json({ error: "Invalid email format" }, { status: 400 })
    }

    const [user] = await sql`
      INSERT INTO users (first_name, last_name, email, phone, profession, relevant_info, created_at)
      VALUES (${firstName}, ${lastName}, ${email}, ${phone}, ${profession}, ${relevantInfo}, NOW())
      RETURNING id, first_name, last_name, email, phone, profession, relevant_info
    `

    return NextResponse.json({ success: true, user })
  } catch (error: any) {
    console.error("[Onboarding error]:", error)

    if (error.code === "23505") {
      return NextResponse.json({ error: "This email is already registered" }, { status: 409 })
    }

    return NextResponse.json({ error: "Failed to create user profile" }, { status: 500 })
  }
}

export async function GET(request: Request) {
  try {
    const { searchParams } = new URL(request.url)
    const type = searchParams.get("type")

    if (type === "professions") {
      const rows = await sql`
        SELECT profession, COUNT(*) as count
        FROM users
        GROUP BY profession
        ORDER BY count DESC
      `
      return NextResponse.json({ professions: rows })
    }

    // default — preserves existing ProfessionalCounter behaviour
    const [result] = await sql`SELECT COUNT(*) as count FROM users`
    return NextResponse.json({ count: parseInt(result.count) })

  } catch (error) {
    return NextResponse.json({ error: "Failed to fetch data" }, { status: 500 })
  }
}