"use client"

import { useState, useEffect } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Progress } from "@/components/ui/progress"
import Link from "next/link"

interface Skin {
  id: number
  name: string
  weapon: string
  rarity: string
  marketValue: number
  image: string
  condition: string
}

interface WonSkin extends Skin {
  bidAmount: number
}

interface Player {
  name: string
  budget: number
  inventory: WonSkin[]
  totalValue: number
}

const CS2_SKINS: Skin[] = [
  {
    id: 1,
    name: "Dragon Lore",
    weapon: "AWP",
    rarity: "Covert",
    marketValue: 2400,
    image: "/placeholder.svg?height=200&width=300",
    condition: "Field-Tested",
  },
  {
    id: 2,
    name: "Howl",
    weapon: "M4A4",
    rarity: "Contraband",
    marketValue: 1800,
    image: "/placeholder.svg?height=200&width=300",
    condition: "Minimal Wear",
  },
  {
    id: 3,
    name: "Fade",
    weapon: "Karambit",
    rarity: "Covert",
    marketValue: 1200,
    image: "/placeholder.svg?height=200&width=300",
    condition: "Factory New",
  },
  {
    id: 4,
    name: "Asiimov",
    weapon: "AK-47",
    rarity: "Covert",
    marketValue: 850,
    image: "/placeholder.svg?height=200&width=300",
    condition: "Well-Worn",
  },
  {
    id: 5,
    name: "Doppler",
    weapon: "Butterfly Knife",
    rarity: "Covert",
    marketValue: 950,
    image: "/placeholder.svg?height=200&width=300",
    condition: "Factory New",
  },
  {
    id: 6,
    name: "Hyper Beast",
    weapon: "M4A1-S",
    rarity: "Covert",
    marketValue: 320,
    image: "/placeholder.svg?height=200&width=300",
    condition: "Field-Tested",
  },
  {
    id: 7,
    name: "Redline",
    weapon: "AK-47",
    rarity: "Classified",
    marketValue: 180,
    image: "/placeholder.svg?height=200&width=300",
    condition: "Minimal Wear",
  },
  {
    id: 8,
    name: "Vulcan",
    weapon: "AK-47",
    rarity: "Covert",
    marketValue: 420,
    image: "/placeholder.svg?height=200&width=300",
    condition: "Field-Tested",
  },
  {
    id: 9,
    name: "Lightning Strike",
    weapon: "AWP",
    rarity: "Classified",
    marketValue: 280,
    image: "/placeholder.svg?height=200&width=300",
    condition: "Factory New",
  },
  {
    id: 10,
    name: "Crimson Web",
    weapon: "Gut Knife",
    rarity: "Covert",
    marketValue: 650,
    image: "/placeholder.svg?height=200&width=300",
    condition: "Minimal Wear",
  },
]

const RARITY_COLORS = {
  Contraband: "bg-red-600",
  Covert: "bg-red-500",
  Classified: "bg-pink-500",
  Restricted: "bg-purple-500",
  "Mil-Spec": "bg-blue-500",
}

export default function DraftDuelsPage() {
  const [gameState, setGameState] = useState<"waiting" | "bidding" | "result" | "finished">("waiting")
  const [currentRound, setCurrentRound] = useState(0)
  const [currentSkin, setCurrentSkin] = useState<Skin | null>(null)
  const [playerBid, setPlayerBid] = useState("")
  const [aiBid, setAiBid] = useState(0)
  const [timeLeft, setTimeLeft] = useState(10)
  const [winner, setWinner] = useState<"player" | "ai" | null>(null)

  const [player, setPlayer] = useState<Player>({
    name: "You",
    budget: 1000,
    inventory: [],
    totalValue: 0,
  })

  const [aiPlayer, setAiPlayer] = useState<Player>({
    name: "AI Opponent",
    budget: 1000,
    inventory: [],
    totalValue: 0,
  })

  const [gameWinner, setGameWinner] = useState<"player" | "ai" | "tie" | null>(null)

  useEffect(() => {
    if (gameState === "waiting" && currentRound < 10) {
      const timer = setTimeout(() => {
        startNewRound()
      }, 2000)
      return () => clearTimeout(timer)
    }
  }, [gameState, currentRound])

  useEffect(() => {
    if (gameState === "bidding" && timeLeft > 0) {
      const timer = setTimeout(() => {
        setTimeLeft(timeLeft - 1)
      }, 1000)
      return () => clearTimeout(timer)
    } else if (gameState === "bidding" && timeLeft === 0) {
      resolveBidding()
    }
  }, [gameState, timeLeft])

  const startNewRound = () => {
    const skin = CS2_SKINS[currentRound]
    setCurrentSkin(skin)
    setPlayerBid("")

    // AI bidding strategy: bid 30-70% of market value, considering budget
    const maxAiBid = Math.min(aiPlayer.budget, skin.marketValue * 0.7)
    const minAiBid = Math.min(aiPlayer.budget, skin.marketValue * 0.3)
    const aiBidAmount = Math.floor(Math.random() * (maxAiBid - minAiBid) + minAiBid)
    setAiBid(aiBidAmount)

    setTimeLeft(10)
    setGameState("bidding")
    setWinner(null)
  }

  const resolveBidding = () => {
    const playerBidAmount = Number.parseInt(playerBid) || 0

    if (playerBidAmount > aiBid && playerBidAmount <= player.budget) {
      // Player wins
      setWinner("player")
      const wonSkin: WonSkin = { ...currentSkin!, bidAmount: playerBidAmount }
      setPlayer((prev) => ({
        ...prev,
        budget: prev.budget - playerBidAmount,
        inventory: [...prev.inventory, wonSkin],
        totalValue: prev.totalValue + currentSkin!.marketValue,
      }))
    } else if (aiBid > playerBidAmount && aiBid <= aiPlayer.budget) {
      // AI wins
      setWinner("ai")
      const wonSkin: WonSkin = { ...currentSkin!, bidAmount: aiBid }
      setAiPlayer((prev) => ({
        ...prev,
        budget: prev.budget - aiBid,
        inventory: [...prev.inventory, wonSkin],
        totalValue: prev.totalValue + currentSkin!.marketValue,
      }))
    } else {
      // No valid bids or tie - no one gets the skin
      setWinner(null)
    }

    setGameState("result")

    setTimeout(() => {
      const nextRound = currentRound + 1
      setCurrentRound(nextRound)

      if (nextRound >= 10) {
        endGame()
      } else {
        setGameState("waiting")
      }
    }, 3000)
  }

  const endGame = () => {
    if (player.totalValue > aiPlayer.totalValue) {
      setGameWinner("player")
    } else if (aiPlayer.totalValue > player.totalValue) {
      setGameWinner("ai")
    } else {
      setGameWinner("tie")
    }
    setGameState("finished")
  }

  const resetGame = () => {
    setGameState("waiting")
    setCurrentRound(0)
    setCurrentSkin(null)
    setPlayerBid("")
    setAiBid(0)
    setTimeLeft(10)
    setWinner(null)
    setGameWinner(null)
    setPlayer({
      name: "You",
      budget: 1000,
      inventory: [],
      totalValue: 0,
    })
    setAiPlayer({
      name: "AI Opponent",
      budget: 1000,
      inventory: [],
      totalValue: 0,
    })
  }

  const handleBidSubmit = () => {
    const bidAmount = Number.parseInt(playerBid)
    if (bidAmount > 0 && bidAmount <= player.budget) {
      resolveBidding()
    }
  }

  if (gameState === "finished") {
    return (
      <div className="min-h-screen bg-gradient-to-br from-slate-900 to-slate-800 p-4">
        <div className="absolute top-4 left-4 z-10">
          <Link href="/">
            <Button variant="outline" className="bg-white/90 hover:bg-white">
              ← Back to Home
            </Button>
          </Link>
        </div>
        <div className="max-w-6xl mx-auto space-y-6">
          <Card className="text-center">
            <CardHeader>
              <CardTitle className="text-3xl">
                {gameWinner === "player" && "🎉 Victory! 🎉"}
                {gameWinner === "ai" && "💔 Defeat 💔"}
                {gameWinner === "tie" && "🤝 It's a Tie! 🤝"}
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-6">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6 text-center">
                <div>
                  <h3 className="text-xl font-bold mb-2">Your Final Score</h3>
                  <p className="text-3xl font-bold text-green-500">${player.totalValue.toLocaleString()}</p>
                  <p className="text-sm text-slate-600">Budget Remaining: ${player.budget}</p>
                </div>
                <div>
                  <h3 className="text-xl font-bold mb-2">AI Final Score</h3>
                  <p className="text-3xl font-bold text-red-500">${aiPlayer.totalValue.toLocaleString()}</p>
                  <p className="text-sm text-slate-600">Budget Remaining: ${aiPlayer.budget}</p>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Final Inventories with Values and Bids */}
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            <Card>
              <CardHeader>
                <CardTitle className="text-blue-600">Your Final Inventory ({player.inventory.length} items)</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="grid grid-cols-3 sm:grid-cols-4 gap-3">
                  {player.inventory.map((skin, index) => (
                    <div
                      key={index}
                      className="relative aspect-square bg-gradient-to-br from-slate-100 to-slate-200 rounded-lg p-2 border-2 border-slate-300 hover:border-blue-400 transition-colors cursor-pointer group"
                    >
                      <div className="absolute top-1 left-1 bg-green-600 text-white text-xs px-1 rounded z-10">
                        ${skin.marketValue}
                      </div>
                      <img
                        src={skin.image || "/placeholder.svg"}
                        alt={skin.name}
                        className="w-full h-full object-cover rounded"
                      />
                      <div className="absolute inset-0 bg-black bg-opacity-0 group-hover:bg-opacity-75 transition-all duration-200 rounded-lg flex items-center justify-center">
                        <div className="text-white text-xs text-center opacity-0 group-hover:opacity-100 transition-opacity p-1">
                          <div className="font-bold">{skin.weapon}</div>
                          <div className="text-xs">{skin.name}</div>
                          <Badge className={`${RARITY_COLORS[skin.rarity as keyof typeof RARITY_COLORS]} text-xs mt-1`}>
                            {skin.rarity}
                          </Badge>
                          <div className="mt-1 text-yellow-300 font-bold">Bid: ${skin.bidAmount}</div>
                        </div>
                      </div>
                    </div>
                  ))}
                  {player.inventory.length === 0 && (
                    <div className="col-span-full text-center text-slate-500 py-8">No items won</div>
                  )}
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle className="text-red-600">AI Final Inventory ({aiPlayer.inventory.length} items)</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="grid grid-cols-3 sm:grid-cols-4 gap-3">
                  {aiPlayer.inventory.map((skin, index) => (
                    <div
                      key={index}
                      className="relative aspect-square bg-gradient-to-br from-slate-100 to-slate-200 rounded-lg p-2 border-2 border-slate-300 hover:border-red-400 transition-colors cursor-pointer group"
                    >
                      <div className="absolute top-1 left-1 bg-green-600 text-white text-xs px-1 rounded z-10">
                        ${skin.marketValue}
                      </div>
                      <img
                        src={skin.image || "/placeholder.svg"}
                        alt={skin.name}
                        className="w-full h-full object-cover rounded"
                      />
                      <div className="absolute inset-0 bg-black bg-opacity-0 group-hover:bg-opacity-75 transition-all duration-200 rounded-lg flex items-center justify-center">
                        <div className="text-white text-xs text-center opacity-0 group-hover:opacity-100 transition-opacity p-1">
                          <div className="font-bold">{skin.weapon}</div>
                          <div className="text-xs">{skin.name}</div>
                          <Badge className={`${RARITY_COLORS[skin.rarity as keyof typeof RARITY_COLORS]} text-xs mt-1`}>
                            {skin.rarity}
                          </Badge>
                          <div className="mt-1 text-yellow-300 font-bold">Bid: ${skin.bidAmount}</div>
                        </div>
                      </div>
                    </div>
                  ))}
                  {aiPlayer.inventory.length === 0 && (
                    <div className="col-span-full text-center text-slate-500 py-8">No items won</div>
                  )}
                </div>
              </CardContent>
            </Card>
          </div>

          <div className="text-center">
            <Button onClick={resetGame} size="lg">
              Play Again
            </Button>
          </div>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 to-slate-800 p-4">
      <div className="absolute top-4 left-4 z-10">
        <Link href="/">
          <Button variant="outline" className="bg-white/90 hover:bg-white">
            ← Back to Home
          </Button>
        </Link>
      </div>
      <div className="max-w-6xl mx-auto space-y-6">
        {/* Header */}
        <div className="text-center text-white">
          <h1 className="text-4xl font-bold mb-2">Skin Draft Duels</h1>
          <p className="text-slate-300">Round {Math.min(currentRound + 1, 10)} of 10</p>
          <Progress value={(Math.min(currentRound, 10) / 10) * 100} className="w-full max-w-md mx-auto mt-2" />
        </div>

        {/* Current Skin - Only show if game is not finished and we have a current skin */}
        {currentSkin && gameState !== "finished" && (
          <Card className="mx-auto max-w-2xl">
            <CardHeader>
              <CardTitle className="text-center">
                {gameState === "waiting" && "Next Item"}
                {gameState === "bidding" && `Bidding Time: ${timeLeft}s`}
                {gameState === "result" && "Auction Result"}
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

              {gameState === "bidding" && (
                <div className="space-y-4">
                  <div className="space-y-2">
                    <h4 className="font-bold text-blue-600">Place Your Bid</h4>
                    <div className="flex gap-2 max-w-sm mx-auto">
                      <input
                        type="number"
                        placeholder="Enter bid amount"
                        value={playerBid}
                        onChange={(e) => setPlayerBid(e.target.value)}
                        max={player.budget}
                        min={0}
                        className="flex-1 px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                      />
                      <Button
                        onClick={handleBidSubmit}
                        disabled={!playerBid || Number.parseInt(playerBid) > player.budget}
                      >
                        Bid
                      </Button>
                    </div>
                    <p className="text-sm text-slate-600">Available Budget: ${player.budget}</p>
                  </div>
                </div>
              )}

              {gameState === "result" && (
                <div className="space-y-2">
                  <div className="text-xl font-bold">
                    {winner === "player" && <p className="text-green-600">🎉 You won this auction!</p>}
                    {winner === "ai" && <p className="text-red-600">💔 AI won this auction!</p>}
                    {winner === null && <p className="text-yellow-600">⚠️ No winner - item discarded!</p>}
                  </div>
                  {currentRound >= 9 && <p className="text-sm text-slate-600 mt-2">Preparing final results...</p>}
                </div>
              )}
            </CardContent>
          </Card>
        )}

        {/* Player Stats */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <Card>
            <CardHeader>
              <CardTitle className="text-blue-600">Your Stats</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-2">
                <p>
                  Budget: <span className="font-bold text-green-600">${player.budget}</span>
                </p>
                <p>Items: {player.inventory.length}</p>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle className="text-red-600">AI Opponent</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-2">
                <p>
                  Budget: <span className="font-bold text-green-600">${aiPlayer.budget}</span>
                </p>
                <p>Items: {aiPlayer.inventory.length}</p>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Inventories */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          <Card>
            <CardHeader>
              <CardTitle className="text-blue-600">Your Inventory ({player.inventory.length} items)</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-3 sm:grid-cols-4 md:grid-cols-5 gap-2">
                {player.inventory.map((skin, index) => (
                  <div
                    key={index}
                    className="relative aspect-square bg-gradient-to-br from-slate-100 to-slate-200 rounded-lg p-2 border-2 border-slate-300 hover:border-blue-400 transition-colors cursor-pointer group"
                  >
                    <img
                      src={skin.image || "/placeholder.svg"}
                      alt={skin.name}
                      className="w-full h-full object-cover rounded"
                    />
                    <div className="absolute inset-0 bg-black bg-opacity-0 group-hover:bg-opacity-75 transition-all duration-200 rounded-lg flex items-center justify-center">
                      <div className="text-white text-xs text-center opacity-0 group-hover:opacity-100 transition-opacity p-1">
                        <div className="font-bold">{skin.weapon}</div>
                        <div className="text-xs">{skin.name}</div>
                        <Badge className={`${RARITY_COLORS[skin.rarity as keyof typeof RARITY_COLORS]} text-xs mt-1`}>
                          {skin.rarity}
                        </Badge>
                      </div>
                    </div>
                  </div>
                ))}
                {/* Empty slots */}
                {Array.from({ length: Math.max(0, 15 - player.inventory.length) }).map((_, index) => (
                  <div
                    key={`empty-${index}`}
                    className="aspect-square bg-slate-50 border-2 border-dashed border-slate-300 rounded-lg"
                  />
                ))}
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle className="text-red-600">AI Inventory ({aiPlayer.inventory.length} items)</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-3 sm:grid-cols-4 md:grid-cols-5 gap-2">
                {aiPlayer.inventory.map((skin, index) => (
                  <div
                    key={index}
                    className="relative aspect-square bg-gradient-to-br from-slate-100 to-slate-200 rounded-lg p-2 border-2 border-slate-300 hover:border-red-400 transition-colors cursor-pointer group"
                  >
                    <img
                      src={skin.image || "/placeholder.svg"}
                      alt={skin.name}
                      className="w-full h-full object-cover rounded"
                    />
                    <div className="absolute inset-0 bg-black bg-opacity-0 group-hover:bg-opacity-75 transition-all duration-200 rounded-lg flex items-center justify-center">
                      <div className="text-white text-xs text-center opacity-0 group-hover:opacity-100 transition-opacity p-1">
                        <div className="font-bold">{skin.weapon}</div>
                        <div className="text-xs">{skin.name}</div>
                        <Badge className={`${RARITY_COLORS[skin.rarity as keyof typeof RARITY_COLORS]} text-xs mt-1`}>
                          {skin.rarity}
                        </Badge>
                      </div>
                    </div>
                  </div>
                ))}
                {/* Empty slots */}
                {Array.from({ length: Math.max(0, 15 - aiPlayer.inventory.length) }).map((_, index) => (
                  <div
                    key={`empty-ai-${index}`}
                    className="aspect-square bg-slate-50 border-2 border-dashed border-slate-300 rounded-lg"
                  />
                ))}
              </div>
            </CardContent>
          </Card>
        </div>

        {gameState === "waiting" && currentRound === 0 && (
          <Card className="text-center">
            <CardContent className="pt-6">
              <p className="text-lg">Get ready to duel! The first skin will appear shortly...</p>
            </CardContent>
          </Card>
        )}
      </div>
    </div>
  )
} 