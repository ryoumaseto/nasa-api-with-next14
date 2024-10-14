'use client'

import { useState } from 'react'
import { getNeoData } from '../actions/nasa-api'
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"

export default function NeoPage() {
  const [startDate, setStartDate] = useState('')
  const [endDate, setEndDate] = useState('')
  interface NeoData {
    element_count: number;
    near_earth_objects: {
      [date: string]: {
        id: string;
        name: string;
        estimated_diameter: {
          kilometers: {
            estimated_diameter_min: number;
            estimated_diameter_max: number;
          };
        };
        is_potentially_hazardous_asteroid: boolean;
        close_approach_data: {
          miss_distance: {
            kilometers: string;
          };
        }[];
      }[];
    };
  }

  const [neoData, setNeoData] = useState<NeoData | null>(null)
  const [error, setError] = useState<string | null>(null)

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    try {
      const data = await getNeoData(startDate, endDate)
      setNeoData(data)
      setError(null)
    } catch (err) {
      console.error(err)
      setError('データの取得中にエラーが発生しました。')
      setNeoData(null)
    }
  }

  return (
    <div className="min-h-screen bg-black text-white pt-20">
      <main className="container mx-auto px-4 py-8">
        <h1 className="text-4xl font-bold mb-8">近地球天体 (NEO) データ</h1>
        {error && (
          <div className="bg-red-500 text-white p-4 rounded-lg mb-4">
            {error}
          </div>
        )}
        <form onSubmit={handleSubmit} className="mb-8 flex gap-4">
          <Input
            type="date"
            value={startDate}
            onChange={(e) => setStartDate(e.target.value)}
            className="bg-gray-800 text-white"
            placeholder="開始日"
          />
          <Input
            type="date"
            value={endDate}
            onChange={(e) => setEndDate(e.target.value)}
            className="bg-gray-800 text-white"
            placeholder="終了日"
          />
          <Button type="submit">検索</Button>
        </form>
        {neoData && (
          <div>
            <p className="text-xl mb-4">検出された近地球天体: {neoData.element_count}</p>
            {Object.entries(neoData.near_earth_objects).map(([date, asteroids]) => (
              <Card key={date} className="bg-gray-800 border-gray-700 mb-4">
                <CardHeader>
                  <CardTitle>{date}</CardTitle>
                </CardHeader>
                <CardContent>
                  {asteroids.map((asteroid) => (
                    <div key={asteroid.id} className="mb-4 p-4 bg-gray-700 rounded-lg">
                      <h3 className="text-lg font-semibold">{asteroid.name}</h3>
                      <p>推定直径: {asteroid.estimated_diameter.kilometers.estimated_diameter_min.toFixed(2)} - {asteroid.estimated_diameter.kilometers.estimated_diameter_max.toFixed(2)} km</p>
                      <p>潜在的に危険: {asteroid.is_potentially_hazardous_asteroid ? 'はい' : 'いいえ'}</p>
                      <p>最接近距離: {parseFloat(asteroid.close_approach_data[0].miss_distance.kilometers).toFixed(2)} km</p>
                    </div>
                  ))}
                </CardContent>
              </Card>
            ))}
          </div>
        )}
      </main>
    </div>
  )
}