import { neon } from "@neondatabase/serverless"
import { NextResponse } from "next/server"

const databaseUrl = process.env.DATABASE_URL

if (!databaseUrl) {
  throw new Error("Missing DATABASE_URL")
}

const sql = neon(databaseUrl)

export async function GET(request: Request) {
  try {
    const { searchParams } = new URL(request.url)
    const q = searchParams.get('q')

    if (!q || q.trim().length < 2) {
      return NextResponse.json([])
    }

    const professions = await sql`
      SELECT profession, COUNT(*) as count
      FROM users
      WHERE profession ILIKE ${'%' + q.trim() + '%'}
      AND profession IS NOT NULL
      AND btrim(profession) <> ''
      GROUP BY profession
      ORDER BY count DESC, profession
      LIMIT 10
    `

    return NextResponse.json(professions.map((p: any) => ({ profession: p.profession, count: Number(p.count) })))
  } catch (error) {
    console.error("[Search Professions Error]:", error)
    return NextResponse.json({ error: "Failed to search professions" }, { status: 500 })
  }
}