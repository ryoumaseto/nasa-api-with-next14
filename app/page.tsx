'use client'

import { useState, useEffect } from 'react'
import { motion } from 'framer-motion'
import { ChevronRight } from 'lucide-react'
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import Link from 'next/link'

export default function Home() {
  const [scrollY, setScrollY] = useState(0)

  useEffect(() => {
    const handleScroll = () => setScrollY(window.scrollY)
    window.addEventListener('scroll', handleScroll)
    return () => window.removeEventListener('scroll', handleScroll)
  }, [])

  return (
    <div className="min-h-screen bg-black text-white overflow-hidden pt-20">
      {/* 背景の星 (unchanged) */}
      <div className="fixed inset-0 z-0">
        {[...Array(100)].map((_, i) => (
          <div
            key={i}
            className="absolute rounded-full bg-white"
            style={{
              top: `${Math.random() * 100}%`,
              left: `${Math.random() * 100}%`,
              width: `${Math.random() * 2 + 1}px`,
              height: `${Math.random() * 2 + 1}px`,
              opacity: Math.random(),
              animation: `twinkle ${Math.random() * 5 + 3}s infinite`,
            }}
          />
        ))}
      </div>

      {/* メインコンテンツ */}
      <main className="relative z-10">
        {/* ヒーローセクション */}
        <section className="h-screen flex items-center justify-center text-center px-4">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 1 }}
          >
            <h1 className="text-5xl md:text-7xl font-bold mb-10 bg-clip-text text-transparent bg-gradient-to-r from-purple-400 to-pink-600">
              NASA Explorer
            </h1>
            <p className="text-xl md:text-2xl mb-8 max-w-2xl mx-auto">
              NASAのデータを使って、宇宙の神秘を探索しましょう。
            </p>
            <Link href="/apod">
              <Button size="lg" className="bg-purple-600 hover:bg-purple-700 text-white">
                探索を始める <ChevronRight className="ml-2" />
              </Button>
            </Link>
          </motion.div>
        </section>

        {/* 探索セクション */}
        <section className="py-20 px-4 bg-gray-900">
          <div className="max-w-6xl mx-auto">
            <h2 className="text-3xl md:text-4xl font-bold mb-12 text-center">NASA  データを探索する</h2>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
              <motion.div
                initial={{ opacity: 0, x: -50 }}
                animate={{ opacity: scrollY > 400 ? 1 : 0, x: scrollY > 400 ? 0 : -50 }}
                transition={{ duration: 0.8 }}
              >
                <Card className="bg-gray-800 border-gray-700">
                  <CardHeader>
                    <CardTitle>今日の天文画像 (APOD)</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <CardDescription>
                      NASAが選んだ、その日の宇宙に関する画像や写真を見ることができます。天文学の知識を深めましょう。
                    </CardDescription>
                  </CardContent>
                  <CardFooter>
                    <Link href="/apod">
                      <Button variant="outline">APODを見る</Button>
                    </Link>
                  </CardFooter>
                </Card>
              </motion.div>
              <motion.div
                initial={{ opacity: 0, x: 50 }}
                animate={{ opacity: scrollY > 400 ? 1 : 0, x: scrollY > 400 ? 0 : 50 }}
                transition={{ duration: 0.8 }}
              >
                <Card className="bg-gray-800 border-gray-700">
                  <CardHeader>
                    <CardTitle>火星探査車の写真</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <CardDescription>
                      火星探査車キュリオシティが撮影した火星の表面写真を閲覧できます。日付やカメラを指定して検索することもできます。
                    </CardDescription>
                  </CardContent>
                  <CardFooter>
                    <Link href="/mars-rover">
                      <Button variant="outline">火星の写真を見る</Button>
                    </Link>
                  </CardFooter>
                </Card>
              </motion.div>
            </div>
          </div>
        </section>
      </main>

      {/* アニメーションのためのスタイル */}
      <style jsx>{`
        @keyframes twinkle {
          0% { opacity: 0; }
          50% { opacity: 1; }
          100% { opacity: 0; }
        }
      `}</style>
    </div>
  );
}
