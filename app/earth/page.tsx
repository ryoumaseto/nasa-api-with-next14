'use client'

import { useState } from 'react'
import Image from 'next/image'
import { getEpicData } from '../actions/nasa-api'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from '@mui/material'
import { Input } from "@/components/ui/input"

export default function EpicPage() {
  interface EpicItem {
    identifier: string;
    caption: string;
    date: string;
    image: string;
  }

  const [date, setDate] = useState('')
  const [epicData, setEpicData] = useState<EpicItem[]>([])
  const [error, setError] = useState<string | null>(null)

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    try {
      const data = await getEpicData(date)
      setEpicData(data)
      setError(null)
    } catch (err) {
      console.error(err)
      setError('データの取得中にエラーが発生しました。')
      setEpicData([])
    }
  }

  return (
    <div className="min-h-screen bg-black text-white pt-20">
      <main className="container mx-auto px-4 py-8">
        <h1 className="text-4xl font-bold mb-8">地球ポリクロマティック撮像カメラ (EPIC)</h1>
        {error && (
          <div className="bg-red-500 text-white p-4 rounded-lg mb-4">
            {error}
          </div>
        )}
         <form onSubmit={handleSubmit} className="mb-8 flex gap-4">
          <Input
            type="date"
            value={date}
            onChange={(e) => setDate(e.target.value)}
            className="bg-gray-800 text-white"
            placeholder="開始日"
          />
          <Button type="submit">検索</Button>
        </form>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {epicData.map((item) => (
            <Card key={item.identifier} className="bg-gray-800 border-gray-700">
              <CardHeader>
                <CardTitle>{item.caption}</CardTitle>
                <CardDescription>{new Date(item.date).toLocaleString()}</CardDescription>
              </CardHeader>
              <CardContent>
                <Image
                  src={`https://epic.gsfc.nasa.gov/archive/natural/${item.date.split(' ')[0].replace(/-/g, '/')}/png/${item.image}.png`}
                  alt={item.caption}
                  width={300}
                  height={300}
                  className="w-full h-auto rounded-lg"
                />
              </CardContent>
            </Card>
          ))}
        </div>
      </main>
    </div>
  )
}