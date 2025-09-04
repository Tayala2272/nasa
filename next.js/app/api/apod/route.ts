

import { NextResponse } from 'next/server'
import axios from 'axios'
import moment from 'moment'

export async function GET() {
    try {
        const today = moment().format('YYYY-MM-DD')
        const nasaApiKey = process.env.NASA_API_KEY

        if (!nasaApiKey) {
            return NextResponse.json(
                { error: 'NASA API key not configured' },
                { status: 500 }
            )
        }

        const response = await axios.get(
            `https://api.nasa.gov/planetary/apod?api_key=${nasaApiKey}`
        )

        return NextResponse.json({ imageUrl: response.data.url });
    } catch (error) {
        console.error(error)
        return NextResponse.json(
            { error: 'Błąd serwera' },
            { status: 500 }
        )
    }
}

export const dynamic = 'force-dynamic'