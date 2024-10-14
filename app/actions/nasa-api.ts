'use server'

import { z } from 'zod'

const NASA_API_KEY = process.env.NASA_API_KEY

const neoSchema = z.object({
    links: z.object({
        next: z.string(),
        previous: z.string(),
        self: z.string(),
    }),
    element_count: z.number(),
    near_earth_objects: z.record(
        z.array(
            z.object({
                id: z.string(),
                neo_reference_id: z.string(),
                name: z.string(),
                nasa_jpl_url: z.string(),
                absolute_magnitude_h: z.number(),
                estimated_diameter: z.object({
                    kilometers: z.object({
                        estimated_diameter_min: z.number(),
                        estimated_diameter_max: z.number(),
                    }),
                    meters: z.object({
                        estimated_diameter_min: z.number(),
                        estimated_diameter_max: z.number(),
                    }),
                    miles: z.object({
                        estimated_diameter_min: z.number(),
                        estimated_diameter_max: z.number(),
                    }),
                    feet: z.object({
                        estimated_diameter_min: z.number(),
                        estimated_diameter_max: z.number(),
                    }),
                }),
                is_potentially_hazardous_asteroid: z.boolean(),
                close_approach_data: z.array(
                    z.object({
                        close_approach_date: z.string(),
                        close_approach_date_full: z.string(),
                        epoch_date_close_approach: z.number(),
                        relative_velocity: z.object({
                            kilometers_per_second: z.string(),
                            kilometers_per_hour: z.string(),
                            miles_per_hour: z.string(),
                        }),
                        miss_distance: z.object({
                            astronomical: z.string(),
                            lunar: z.string(),
                            kilometers: z.string(),
                            miles: z.string(),
                        }),
                        orbiting_body: z.string(),
                    })
                ),
                is_sentry_object: z.boolean(),
            })
        )
    ),
})

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

export async function getNeoData(startDate: string, endDate: string) {
    const url = `https://api.nasa.gov/neo/rest/v1/feed?start_date=${startDate}&end_date=${endDate}&api_key=${NASA_API_KEY}`
    const response = await fetch(url)
    if (!response.ok) {
        throw new Error(`Failed to fetch NEO data: ${response.statusText}`)
    }
    const data = await response.json()
    try {
        return neoSchema.parse(data)
    } catch (e) {
        console.error('NEO data validation error:', e)
        throw new Error('Invalid NEO data received from NASA API')
    }
  }
  
  export async function getEpicData(date: string) {
    const url = `https://api.nasa.gov/EPIC/api/natural/date/${date}?api_key=${NASA_API_KEY}`
    const response = await fetch(url)
    console.log(url)
    if (!response.ok) {
      throw new Error(`Failed to fetch EPIC data: ${response.statusText}`)
    }
    const data = await response.json()
    try {
        console.log(url)
        console.log(data)
      return (data)
    } catch (e) {
      console.error('EPIC data validation error:', e)
      throw new Error('Invalid EPIC data received from NASA API')
    }
  }