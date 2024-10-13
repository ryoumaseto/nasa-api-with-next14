'use client'

import { useState } from 'react'
import { getMarsPhotos } from '../actions/nasa-api'
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import Image from 'next/image'

const cameras = [
  { value: 'FHAZ', label: 'Front Hazard Avoidance Camera' },
  { value: 'RHAZ', label: 'Rear Hazard Avoidance Camera' },
  { value: 'MAST', label: 'Mast Camera' },
  { value: 'CHEMCAM', label: 'Chemistry and Camera Complex' },
  { value: 'MAHLI', label: 'Mars Hand Lens Imager' },
  { value: 'MARDI', label: 'Mars Descent Imager' },
  { value: 'NAVCAM', label: 'Navigation Camera' },
]

const rovers = [
  { value: 'Curiosity', label: 'Curiosity' },
  { value: 'Opportunity', label: 'Opportunity' },
  { value: 'Spirit', label: 'Spirit' },
]

export default function MarsRoverPage() {
  const [date, setDate] = useState('')
  const [camera, setCamera] = useState('')
  interface Photo {
    id: number;
    sol: number;
    camera: {
      id: number;
      name: string;
      rover_id: number;
      full_name: string;
    };
    img_src: string;
    earth_date: string;
    rover: {
      id: number;
      status: string;
      name: string;
      landing_date: string;
      launch_date: string;
    };
  }

  const [photos, setPhotos] = useState<Photo[]>([])
  const [error, setError] = useState<string | null>(null)
  const [rover, setRover] = useState('Curiosity')

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    try {
      const data = await getMarsPhotos(rover,date, camera)
      setPhotos(data)
      setError(null)
    } catch (err) {
      console.error(err)
      setError('データの取得中にエラーが発生しました。')
      setPhotos([])
    }
  }

  return (
    <div className="min-h-screen bg-black text-white pt-20">
      <main className="container mx-auto px-4 py-8">
        <h1 className="text-4xl font-bold mb-8">火星探査車の写真</h1>
        {error && (
          <div className="bg-red-500 text-white p-4 rounded-lg mb-4">
            {error}
          </div>
        )}
        <form onSubmit={handleSubmit} className="mb-8 flex gap-4">
          <Select value={rover} onValueChange={setRover}>
            <SelectTrigger className="bg-gray-800 text-white">
              <SelectValue placeholder="探査車を選択" />
            </SelectTrigger>
            <SelectContent>
              {rovers.map((rover) => (
                <SelectItem key={rover.value} value={rover.value}>
                  {rover.label}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
          <Input
            type="date"
            value={date}
            onChange={(e) => setDate(e.target.value)}
            className="bg-gray-800 text-white"
          />
          <Select value={camera} onValueChange={setCamera}>
            <SelectTrigger className="bg-gray-800 text-white">
              <SelectValue placeholder="カメラを選択" />
            </SelectTrigger>
            <SelectContent>
              {cameras.map((cam) => (
                <SelectItem key={cam.value} value={cam.value}>
                  {cam.label}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
          <Button type="submit">検索</Button>
        </form>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {photos.length === 0 ? (
            <div className="text-center col-span-full">
              <p className="text-xl">画像がありません</p>
            </div>
            ) : (
            photos.map((photo) => (
              <Card key={photo.id} className="bg-gray-800 border-gray-700">
              <CardHeader>
                <CardTitle>写真 ID: {photo.id}</CardTitle>
                <CardDescription>撮影日: {photo.earth_date}</CardDescription>
              </CardHeader>
              <CardContent>
                <Image
                src={photo.img_src}
                alt={`Mars Rover Photo ${photo.id}`}
                width={400}
                height={400}
                className="w-full h-auto rounded-lg"
                onError={(e) => {
                  e.currentTarget.src = '/placeholder.svg'
                }}
                />
                <p className="mt-2">カメラ: {photo.camera.full_name}</p>
              </CardContent>
              </Card>
            ))
            )}
        </div>
      </main>
    </div>
  )
}