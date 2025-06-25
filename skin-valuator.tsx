"use client"

import { useState, useEffect } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Progress } from "@/components/ui/progress"

interface Skin {
  id: number
  name: string
  weapon: string
  rarity: string
  marketValue: number
  image: string
  condition: string
}

interface GuessResult {
  skin: Skin
  guess: number
  actualValue: number
  difference: number
  score: number
}

const VALUATOR_SKINS: Skin[] = [
  {
    id: 1,
    name: "Medusa",
    weapon: "AWP",
    rarity: "Covert",
    marketValue: 3200,
    image: "/placeholder.svg?height=200&width=300",
    condition: "Well-Worn",
  },
  {
    id: 2,
    name: "Fire Serpent",
    weapon: "AK-47",
    rarity: "Covert",
    marketValue: 1650,
    image: "/placeholder.svg?height=200&width=300",
    condition: "Field-Tested",
  },
  {
    id: 3,
    name: "Marble Fade",
    weapon: "Karambit",
    rarity: "Covert",
    marketValue: 2100,
    image: "/placeholder.svg?height=200&width=300",
    condition: "Factory New",
  },
  {
    id: 4,
    name: "Printstream",
    weapon: "M4A1-S",
    rarity: "Covert",
    marketValue: 420,
    image: "/placeholder.svg?height=200&width=300",
    condition: "Minimal Wear",
  },
  {
    id: 5,
    name: "Bloodsport",
    weapon: "AK-47",
    rarity: "Covert",
    marketValue: 180,
    image: "/placeholder.svg?height=200&width=300",
    condition: "Field-Tested",
  },
  {
    id: 6,
    name: "Neo-Noir",
    weapon: "AWP",
    rarity: "Covert",
    marketValue: 95,
    image: "/placeholder.svg?height=200&width=300",
    condition: "Factory New",
  },
  {
    id: 7,
    name: "Gamma Doppler",
    weapon: "Flip Knife",
    rarity: "Covert",
    marketValue: 850,
    image: "/placeholder.svg?height=200&width=300",
    condition: "Factory New",
  },
  {
    id: 8,
    name: "Neon Revolution",
    weapon: "AK-47",
    rarity: "Classified",
    marketValue: 65,
    image: "/placeholder.svg?height=200&width=300",
    condition: "Minimal Wear",
  },
  {
    id: 9,
    name: "Desolate Space",
    weapon: "M4A4",
    rarity: "Classified",
    marketValue: 45,
    image: "/placeholder.svg?height=200&width=300",
    condition: "Field-Tested",
  },
  {
    id: 10,
    name: "Phantom Disruptor",
    weapon: "AWP",
    rarity: "Classified",
    marketValue: 25,
    image: "/placeholder.svg?height=200&width=300",
    condition: "Factory New",
  },
]

const RARITY_COLORS = {
  Contraband: "bg-red-600",
  Covert: "bg-red-500",
  Classified: "bg-pink-500",
  Restricted: "bg-purple-500",
  "Mil-Spec": "bg-blue-500",
}

export default function SkinValuator() {
  const [gameState, setGameState] = useState<"guessing" | "result" | "finished">("guessing")
  const [currentRound, setCurrentRound] = useState(0)
  const [currentSkin, setCurrentSkin] = useState<Skin | null>(null)
  const [playerGuess, setPlayerGuess] = useState("")
  const [gameResults, setGameResults] = useState<GuessResult[]>([])
  const [totalScore, setTotalScore] = useState(0)
  const [gameSkins, setGameSkins] = useState<Skin[]>([])

  useEffect(() => {
    // Initialize game with 5 random skins
    const shuffled = [...VALUATOR_SKINS].sort(() => 0.5 - Math.random())
    const selectedSkins = shuffled.slice(0, 5)
    setGameSkins(selectedSkins)
    setCurrentSkin(selectedSkins[0])
  }, [])

  const calculateScore = (guess: number, actual: number): number => {
    const difference = Math.abs(guess - actual)
    const percentageOff = (difference / actual) * 100

    if (percentageOff <= 5) return 1000 // Perfect guess (within 5%)
    if (percentageOff <= 10) return 800 // Excellent (within 10%)
    if (percentageOff <= 20) return 600 // Good (within 20%)
    if (percentageOff <= 35) return 400 // Fair (within 35%)
    if (percentageOff <= 50) return 200 // Poor (within 50%)
    return 100 // Very poor (over 50% off)
  }

  const handleGuessSubmit = () => {
    const guess = Number.parseInt(playerGuess)
    if (!guess || guess <= 0 || !currentSkin) return

    const difference = Math.abs(guess - currentSkin.marketValue)
    const score = calculateScore(guess, currentSkin.marketValue)

    const result: GuessResult = {
      skin: currentSkin,
      guess,
      actualValue: currentSkin.marketValue,
      difference,
      score,
    }

    setGameResults((prev) => [...prev, result])
    setTotalScore((prev) => prev + score)
    setGameState("result")

    setTimeout(() => {
      const nextRound = currentRound + 1
      setCurrentRound(nextRound)

      if (nextRound >= 5) {
        setGameState("finished")
      } else {
        setCurrentSkin(gameSkins[nextRound])
        setPlayerGuess("")
        setGameState("guessing")
      }
    }, 3000)
  }

  const resetGame = () => {
    setGameState("guessing")
    setCurrentRound(0)
    setPlayerGuess("")
    setGameResults([])
    setTotalScore(0)

    // Select new random skins
    const shuffled = [...VALUATOR_SKINS].sort(() => 0.5 - Math.random())
    const selectedSkins = shuffled.slice(0, 5)
    setGameSkins(selectedSkins)
    setCurrentSkin(selectedSkins[0])
  }

  const getScoreRating = (score: number): { text: string; color: string } => {
    if (score >= 4000) return { text: "LEGENDARY", color: "text-yellow-500" }
    if (score >= 3500) return { text: "EXPERT", color: "text-purple-500" }
    if (score >= 3000) return { text: "SKILLED", color: "text-blue-500" }
    if (score >= 2500) return { text: "DECENT", color: "text-green-500" }
    if (score >= 2000) return { text: "NOVICE", color: "text-orange-500" }
    return { text: "BEGINNER", color: "text-red-500" }
  }

  if (gameState === "finished") {
    const rating = getScoreRating(totalScore)

    return (
      <div className="min-h-screen bg-gradient-to-br from-slate-900 to-slate-800 p-4">
        <div className="max-w-4xl mx-auto space-y-6">
          <Card className="text-center">
            <CardHeader>
              <CardTitle className="text-3xl">🎯 Final Results</CardTitle>
            </CardHeader>
            <CardContent className="space-y-6">
              <div className="text-center">
                <p className="text-5xl font-bold text-green-500 mb-2">{totalScore.toLocaleString()}</p>
                <p className="text-xl font-bold mb-2">Total Score</p>
                <Badge
                  className={`text-lg px-4 py-2 ${rating.color.replace("text-", "bg-").replace("-500", "-600")} text-white`}
                >
                  {rating.text}
                </Badge>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>Detailed Results</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {gameResults.map((result, index) => (
                  <div key={index} className="flex items-center justify-between p-4 bg-slate-50 rounded-lg">
                    <div className="flex items-center gap-4">
                      <img
                        src={result.skin.image || "/placeholder.svg"}
                        alt={result.skin.name}
                        className="w-16 h-16 rounded object-cover"
                      />
                      <div>
                        <h3 className="font-bold">
                          {result.skin.weapon} | {result.skin.name}
                        </h3>
                        <Badge className={RARITY_COLORS[result.skin.rarity as keyof typeof RARITY_COLORS]}>
                          {result.skin.rarity}
                        </Badge>
                      </div>
                    </div>
                    <div className="text-right">
                      <p className="text-sm text-slate-600">
                        Your Guess: <span className="font-bold">${result.guess}</span>
                      </p>
                      <p className="text-sm text-slate-600">
                        Actual Value: <span className="font-bold text-green-600">${result.actualValue}</span>
                      </p>
                      <p className="text-sm text-slate-600">
                        Difference: <span className="font-bold text-red-600">${result.difference}</span>
                      </p>
                      <p className="text-lg font-bold text-blue-600">{result.score} points</p>
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>

          <div className="text-center">
            <Button onClick={resetGame} size="lg">
              Play Again
            </Button>
          </div>
        </div>
      </div>
    )
  }

  if (!currentSkin) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-slate-900 to-slate-800 flex items-center justify-center">
        <Card>
          <CardContent className="pt-6">
            <p className="text-lg">Loading skins...</p>
          </CardContent>
        </Card>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 to-slate-800 p-4">
      <div className="max-w-4xl mx-auto space-y-6">
        {/* Header */}
        <div className="text-center text-white">
          <h1 className="text-4xl font-bold mb-2">SkinValuator</h1>
          <p className="text-slate-300">Skin {currentRound + 1} of 5</p>
          <Progress value={((currentRound + 1) / 5) * 100} className="w-full max-w-md mx-auto mt-2" />
        </div>

        {/* Current Score */}
        <Card className="text-center">
          <CardContent className="pt-6">
            <p className="text-2xl font-bold text-green-600">{totalScore.toLocaleString()} points</p>
            <p className="text-sm text-slate-600">Current Score</p>
          </CardContent>
        </Card>

        {/* Current Skin */}
        <Card className="mx-auto max-w-2xl">
          <CardHeader>
            <CardTitle className="text-center">
              {gameState === "guessing" && "What's this skin worth?"}
              {gameState === "result" && "Result"}
            </CardTitle>
          </CardHeader>
          <CardContent className="text-center space-y-4">
            <img
              src={currentSkin.image || "/placeholder.svg"}
              alt={currentSkin.name}
              className="w-full max-w-sm mx-auto rounded-lg"
            />
            <div className="space-y-2">
              <h3 className="text-2xl font-bold">
                {currentSkin.weapon} | {currentSkin.name}
              </h3>
              <div className="flex justify-center gap-2">
                <Badge className={RARITY_COLORS[currentSkin.rarity as keyof typeof RARITY_COLORS]}>
                  {currentSkin.rarity}
                </Badge>
                <Badge variant="outline">{currentSkin.condition}</Badge>
              </div>
            </div>

            {gameState === "guessing" && (
              <div className="space-y-4">
                <div className="space-y-2">
                  <h4 className="font-bold text-green-600">Enter Your Price Guess</h4>
                  <div className="flex gap-2 max-w-sm mx-auto">
                    <div className="flex-1 relative">
                      <span className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-500">$</span>
                      <input
                        type="number"
                        placeholder="0"
                        value={playerGuess}
                        onChange={(e) => setPlayerGuess(e.target.value)}
                        min={1}
                        className="w-full pl-8 pr-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-green-500"
                      />
                    </div>
                    <Button
                      onClick={handleGuessSubmit}
                      disabled={!playerGuess || Number.parseInt(playerGuess) <= 0}
                      className="bg-green-600 hover:bg-green-700"
                    >
                      Submit
                    </Button>
                  </div>
                  <p className="text-sm text-slate-600">Enter the price in USD</p>
                </div>
              </div>
            )}

            {gameState === "result" && gameResults.length > 0 && (
              <div className="space-y-4">
                <div className="text-xl font-bold">
                  <p className="text-green-600">Actual Value: ${gameResults[gameResults.length - 1].actualValue}</p>
                  <p className="text-blue-600">Your Guess: ${gameResults[gameResults.length - 1].guess}</p>
                  <p className="text-purple-600">You scored: {gameResults[gameResults.length - 1].score} points!</p>
                </div>
                {currentRound >= 4 && <p className="text-sm text-slate-600 mt-2">Calculating final results...</p>}
              </div>
            )}
          </CardContent>
        </Card>

        {/* Previous Results */}
        {gameResults.length > 0 && gameState === "guessing" && (
          <Card>
            <CardHeader>
              <CardTitle>Previous Results</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-2">
                {gameResults.map((result, index) => (
                  <div key={index} className="flex items-center justify-between p-2 bg-slate-50 rounded">
                    <span className="text-sm">
                      {result.skin.weapon} | {result.skin.name}
                    </span>
                    <div className="text-sm">
                      <span className="text-slate-600">Guessed: ${result.guess}</span>
                      <span className="mx-2">•</span>
                      <span className="text-green-600">Actual: ${result.actualValue}</span>
                      <span className="mx-2">•</span>
                      <span className="text-blue-600">{result.score} pts</span>
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        )}
      </div>
    </div>
  )
}
