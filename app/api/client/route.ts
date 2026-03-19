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

    const { firstName, lastName, phone } = {
      firstName: clean(body.firstName),
      lastName: clean(body.lastName),
      phone: clean(body.phone),
    }

    // Validation
    if (!firstName || !lastName || !phone) {
      return NextResponse.json(
        { error: "All fields are required" },
        { status: 400 }
      )
    }

    // Insert client
    const [client] = await sql`
      INSERT INTO clients (first_name, last_name, phone, created_at)
      VALUES (${firstName}, ${lastName}, ${phone}, NOW())
      RETURNING id, first_name, last_name, phone
    `

    return NextResponse.json({
      success: true,
      user: client,
    })
  } catch (error: any) {
    console.error("[Client API Error]:", error)

    // Duplicate phone error
    if (error.code === "23505") {
      return NextResponse.json(
        { error: "Client with this phone already exists" },
        { status: 409 }
      )
    }

    return NextResponse.json(
      { error: "Failed to create user profile" },
      { status: 500 }
    )
  }
}

export async function GET() {
  try {
    const [result] = await sql`SELECT COUNT(*) as count FROM clients`

    return NextResponse.json({
      count: parseInt(result.count),
    })
  } catch (error) {
    console.error("[Count Error]:", error)

    return NextResponse.json(
      { error: "Failed to fetch count" },
      { status: 500 }
    )
  }
}