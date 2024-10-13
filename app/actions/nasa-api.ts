'use server'

import { z } from 'zod'

const NASA_API_KEY = process.env.NASA_API_KEY

const apodSchema = z.object({
    date: z.string(),
    explanation: z.string(),
    hdurl: z.string().optional(),
    media_type: z.string(),
    service_version: z.string(),
    title: z.string(),
    url: z.string(),
})

const marsPhotoSchema = z.object({
    id: z.number(),
    sol: z.number(),
    camera: z.object({
        id: z.number(),
        name: z.string(),
        rover_id: z.number(),
        full_name: z.string(),
    }),
    img_src: z.string(),
    earth_date: z.string(),
    rover: z.object({
        id: z.number(),
        name: z.string(),
        landing_date: z.string(),
        launch_date: z.string(),
        status: z.string(),
    }),
})

export async function getApod(date?: string) {
    const url = `https://api.nasa.gov/planetary/apod?api_key=${NASA_API_KEY}${date ? `&date=${date}` : ''}`
    const response = await fetch(url)
    console.log(url)
    if (!response.ok) {
        throw new Error(`Failed to fetch APOD: ${response.statusText}`)
    }
    const data = await response.json()
    try {
        return apodSchema.parse(data)
    } catch (e) {
        console.error('APOD data validation error:', e)
        throw new Error('Invalid APOD data received from NASA API')
    }
}

export async function getMarsPhotos(rover: string ,date?: string, camera?: string) {
    const url = `https://api.nasa.gov/mars-photos/api/v1/rovers/${rover}/photos?sol=1000?earth_date${date}&camera=${camera}&api_key=${NASA_API_KEY}&page=2`
    console.log(url)
    const response = await fetch(url)
    if (!response.ok) {
        throw new Error(`Failed to fetch Mars photos: ${response.statusText}`)
    }
    const data = await response.json()
    try {
        console.log(url)
        return z.array(marsPhotoSchema).parse(data.photos)
    } catch (e) {
        console.error('Mars photos data validation error:', e)
        throw new Error('Invalid Mars photos data received from NASA API')
    }
}