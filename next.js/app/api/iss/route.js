


import { NextResponse } from 'next/server'
import axios from 'axios'
import moment from 'moment'

export async function GET() {
    try {
        const response = await axios.get('http://api.open-notify.org/astros.json')
        
        const astronauts = response.data.people
            .filter(person => person.craft === 'ISS')
            .map(person => `${person.name}`)

        return NextResponse.json(astronauts)
    } catch (error) {
        console.error(error)
        return NextResponse.json(
            { error: 'Błąd serwera' },
            { status: 500 }
        )
    }
}

export const dynamic = 'force-dynamic';