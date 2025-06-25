"use client"

import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Trophy, Target, Gamepad2 } from "lucide-react"
import Link from "next/link"

export default function HomePage() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 to-slate-800">
      {/* Header */}
      <div className="text-center pt-12 pb-8">
        <h1 className="text-6xl font-bold text-white mb-4">CS2 Skin Games</h1>
        <p className="text-xl text-slate-300 max-w-2xl mx-auto px-4">
          Test your CS2 skin knowledge with our collection of exciting games. From strategic bidding to price guessing -
          how well do you know the market?
        </p>
      </div>

      {/* Game Modes */}
      <div className="max-w-6xl mx-auto px-4 pb-12">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
          {/* Skin Draft Duels */}
          <Card className="hover:shadow-2xl transition-all duration-300 hover:scale-105 cursor-pointer group">
            <CardHeader className="text-center pb-4">
              <div className="mx-auto mb-4 p-4 bg-blue-100 rounded-full w-20 h-20 flex items-center justify-center group-hover:bg-blue-200 transition-colors">
                <Trophy className="w-10 h-10 text-blue-600" />
              </div>
              <CardTitle className="text-2xl font-bold text-slate-800">Skin Draft Duels</CardTitle>
              <Badge className="bg-red-500 text-white mx-auto">Strategy</Badge>
            </CardHeader>
            <CardContent className="space-y-4">
              <p className="text-slate-600 text-center">
                Compete against AI in strategic bidding wars! You both start with $1000 to bid on 10 rare CS2 skins. The
                player with the highest valued inventory wins.
              </p>
              <div className="space-y-2 text-sm text-slate-500">
                <div className="flex items-center justify-between">
                  <span>• Duration:</span>
                  <span>5-10 minutes</span>
                </div>
                <div className="flex items-center justify-between">
                  <span>• Difficulty:</span>
                  <span>Medium</span>
                </div>
                <div className="flex items-center justify-between">
                  <span>• Skills:</span>
                  <span>Strategy, Market Knowledge</span>
                </div>
              </div>
              <Link href="/draft-duels">
                <Button className="w-full bg-blue-600 hover:bg-blue-700 text-white font-semibold py-3" size="lg">
                  <Gamepad2 className="w-5 h-5 mr-2" />
                  Start Dueling
                </Button>
              </Link>
            </CardContent>
          </Card>

          {/* SkinValuator */}
          <Card className="hover:shadow-2xl transition-all duration-300 hover:scale-105 cursor-pointer group">
            <CardHeader className="text-center pb-4">
              <div className="mx-auto mb-4 p-4 bg-green-100 rounded-full w-20 h-20 flex items-center justify-center group-hover:bg-green-200 transition-colors">
                <Target className="w-10 h-10 text-green-600" />
              </div>
              <CardTitle className="text-2xl font-bold text-slate-800">SkinValuator</CardTitle>
              <Badge className="bg-green-500 text-white mx-auto">Precision</Badge>
            </CardHeader>
            <CardContent className="space-y-4">
              <p className="text-slate-600 text-center">
                Like GeoGuesser but for CS2 skins! You'll be shown 5 different skins and must guess their market prices.
                Score points based on how close your guesses are.
              </p>
              <div className="space-y-2 text-sm text-slate-500">
                <div className="flex items-center justify-between">
                  <span>• Duration:</span>
                  <span>3-5 minutes</span>
                </div>
                <div className="flex items-center justify-between">
                  <span>• Difficulty:</span>
                  <span>Hard</span>
                </div>
                <div className="flex items-center justify-between">
                  <span>• Skills:</span>
                  <span>Price Knowledge, Intuition</span>
                </div>
              </div>
              <Link href="/skin-valuator">
                <Button className="w-full bg-green-600 hover:bg-green-700 text-white font-semibold py-3" size="lg">
                  <Target className="w-5 h-5 mr-2" />
                  Start Guessing
                </Button>
              </Link>
            </CardContent>
          </Card>
        </div>

        {/* Coming Soon Section */}
        <div className="mt-12 text-center">
          <h2 className="text-3xl font-bold text-white mb-6">More Games Coming Soon</h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <Card className="opacity-60">
              <CardContent className="pt-6 text-center">
                <div className="mx-auto mb-4 p-4 bg-purple-100 rounded-full w-16 h-16 flex items-center justify-center">
                  <span className="text-2xl">🎰</span>
                </div>
                <h3 className="font-bold text-slate-800 mb-2">Skin Roulette</h3>
                <p className="text-sm text-slate-600">Spin the wheel and win rare skins</p>
              </CardContent>
            </Card>
            <Card className="opacity-60">
              <CardContent className="pt-6 text-center">
                <div className="mx-auto mb-4 p-4 bg-yellow-100 rounded-full w-16 h-16 flex items-center justify-center">
                  <span className="text-2xl">⚡</span>
                </div>
                <h3 className="font-bold text-slate-800 mb-2">Speed Trader</h3>
                <p className="text-sm text-slate-600">Fast-paced skin trading challenges</p>
              </CardContent>
            </Card>
            <Card className="opacity-60">
              <CardContent className="pt-6 text-center">
                <div className="mx-auto mb-4 p-4 bg-red-100 rounded-full w-16 h-16 flex items-center justify-center">
                  <span className="text-2xl">🏆</span>
                </div>
                <h3 className="font-bold text-slate-800 mb-2">Tournament Mode</h3>
                <p className="text-sm text-slate-600">Compete in elimination brackets</p>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>

      {/* Footer */}
      <div className="text-center py-8 border-t border-slate-700">
        <p className="text-slate-400">Made for CS2 skin enthusiasts • Test your market knowledge • Have fun!</p>
      </div>
    </div>
  )
}
