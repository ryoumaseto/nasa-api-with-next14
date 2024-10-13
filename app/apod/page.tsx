'use client'

import { useState } from 'react'
import Image from 'next/image'
import { getApod } from '../actions/nasa-api'
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"


export default function ApodPage() {
    const [date, setDate] = useState<string>('')
    const [apod, setApod] = useState<Apod | null>(null)
    const [error, setError] = useState<string | null>(null)
    interface Apod {
        date: string;
        explanation: string;
        hdurl?: string;
        media_type: string;
        service_version: string;
        title: string;
        url: string;
    }
    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault()
        try {
            const data = await getApod(date)
            setApod(data)
            setError(null)
        } catch (err) {
            console.error(err)
            setError('データの取得中にエラーが発生しました。')
            setApod(null)
        }
    }

    return (
        <div className="min-h-screen bg-black text-white pt-20">
            <main className="container mx-auto px-4 py-8">
                <h1 className="text-4xl font-bold mb-8">今日の天文画像 (APOD)</h1>
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
                    />
                    <Button type="submit">検索</Button>
                </form>
                {apod && (
                    <Card className="bg-gray-800 border-gray-700">
                        <CardHeader>
                            <CardTitle className='text-4xl text-white'>{apod.title}</CardTitle>
                            <CardDescription>{apod.date}</CardDescription>
                        </CardHeader>
                        <CardContent>
                            <Image
                                src={apod.url}
                                alt={apod.title}
                                width={800}
                                height={600}
                                className="w-full h-auto rounded-lg"
                                onError={(e) => {
                                    e.currentTarget.src = '/placeholder.svg'
                                }}
                            />
                        </CardContent>
                        <CardFooter className=''>
                            <div className="border border-gray-700 p-4 rounded-lg">
                                <p className="mt-3 text-white">
                                    <span className="text-2xl">{apod.explanation.charAt(0)}</span>
                                    {apod.explanation.slice(1)}
                                </p>
                            </div>
                        </CardFooter>
                    </Card>
                )}
            </main>
        </div>
    )
}