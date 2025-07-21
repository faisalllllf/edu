import { db } from "@/lib/db"

export async function POST(req: Request) {
  try {
    const { name, date } = await req.json()

    if (!name || !date) {
      return new Response(JSON.stringify({ error: 'Name and date are required.' }), { status: 400 })
    }

    await db.query('INSERT INTO holidays (name, date) VALUES (?, ?)', [name, date])

    return new Response(JSON.stringify({ success: true }), { status: 201 })
  } catch (error) {
    console.error('Error adding holiday:', error)
    return new Response(JSON.stringify({ error: 'Internal Server Error' }), { status: 500 })
  }
}
