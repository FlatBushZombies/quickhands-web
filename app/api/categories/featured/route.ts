import { neon } from "@neondatabase/serverless"
import { NextResponse } from "next/server"

const databaseUrl = process.env.DATABASE_URL

if (!databaseUrl) {
  throw new Error("Missing DATABASE_URL")
}

const sql = neon(databaseUrl)

export async function GET() {
  try {
    const [result] = await sql`
      SELECT
        initcap(lower(btrim(profession))) AS category,
        COUNT(*)::int AS signup_count
      FROM users
      WHERE profession IS NOT NULL
        AND btrim(profession) <> ''
      GROUP BY lower(btrim(profession))
      ORDER BY COUNT(*) DESC
      LIMIT 1
    `

    if (!result?.category) {
      return NextResponse.json(
        { error: "No categories found" },
        { status: 404 }
      )
    }

    return NextResponse.json({
      category: result.category,
      signupCount: Number(result.signup_count ?? 0),
    })
  } catch (error) {
    console.error("[Featured Category Error]:", error)

    return NextResponse.json(
      { error: "Failed to fetch featured category" },
      { status: 500 }
    )
  }
}
