"use client"

import { useState, useEffect } from "react"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Progress } from "@/components/ui/progress"
import { Zap, Gamepad2, Apple, Star, LogOut, Plus, Bug, Skull, Target } from "lucide-react"

interface PetResponseDTO {
  id: number
  name: string
  species: string
  hunger: number
  aggressiveness: number
  level: number
  status: string
}

interface UserResponseDTO {
  id: number
  email: string
  username: string
}

const ALIEN_SPECIES = [
  { id: "FACEHUGGER", name: "FACEHUGGER", icon: "🕷️", rarity: "Rare" },
  { id: "NEUROMANCER", name: "NEUROMANCER", icon: "🧠", rarity: "Epic" },
  { id: "PREDATOR", name: "PREDATOR", icon: "🦾", rarity: "Legendary" },
  { id: "XENOMORPH", name: "XENOMORPH", icon: "👽", rarity: "Legendary" },
  { id: "ACIDSPITTER", name: "ACIDSPITTER", icon: "🐙", rarity: "Epic" },
]

const SPECIES_INFO = {
  XENOMORPH: {
    description:
      "Apex predator from LV-426. Highly aggressive biomechanical organism with acidic blood and incredible adaptability.",
    origin: "Discovered on moon LV-426",
    traits: ["Acidic Blood", "Rapid Growth", "Perfect Organism"],
    care: "Requires high protein diet and secure containment. Extremely dangerous when hungry.",
  },
  PREDATOR: {
    description:
      "Elite hunter from Yautja Prime. Advanced warrior species with sophisticated technology and honor-based culture.",
    origin: "Yautja Prime system",
    traits: ["Thermal Vision", "Advanced Tech", "Honor Code"],
    care: "Responds well to combat training. Requires challenging activities to prevent boredom.",
  },
  FACEHUGGER: {
    description:
      "First stage of Xenomorph lifecycle. Parasitic organism designed for host implantation with incredible agility.",
    origin: "Xenomorph egg chambers",
    traits: ["Lightning Speed", "Parasitic", "Acidic Blood"],
    care: "Keep in secure bio-containment. Extremely aggressive when seeking hosts.",
  },
  ACIDSPITTER: {
    description:
      "Mutated alien variant capable of projecting corrosive compounds. Highly territorial with unique defensive mechanisms.",
    origin: "Unknown mutation source",
    traits: ["Acid Projection", "Territorial", "Adaptive"],
    care: "Requires acid-resistant environment. Feed regularly to prevent aggressive outbursts.",
  },
  NEUROMANCER: {
    description:
      "Psychic alien entity with advanced neural capabilities. Can manipulate electronic systems and read thoughts.",
    origin: "Deep space anomaly",
    traits: ["Telepathic", "Tech Interface", "Energy Manipulation"],
    care: "Sensitive to electromagnetic fields. Requires mental stimulation and isolation from electronics.",
  },
}

const getAlienImage = (species: string, status: string) => {
  const speciesMap: { [key: string]: string } = {
    FACEHUGGER: "face",
    NEUROMANCER: "neur",
    PREDATOR: "pred",
    XENOMORPH: "xeno",
    ACIDSPITTER: "split",
  }

  const speciesKey = speciesMap[species] || "neur"
  const statusKey = status.toLowerCase()

  const imageMap: { [key: string]: { [key: string]: string } } = {
    face: {
      calm: "https://hebbkx1anhila5yf.public.blob.vercel-storage.com/face_CALM-OBhBHwedDsW4FJEvpZnbRy8cR8dvze.png",
      angry: "https://hebbkx1anhila5yf.public.blob.vercel-storage.com/face_ANGRY-4inQFkJvHyNOLFcQgZQFDsIyQWTZGQ.png",
      rebellious:
        "https://hebbkx1anhila5yf.public.blob.vercel-storage.com/face_REBEL-xogJqw4vk7O65TTwhRFewe6jyHyfSF.png",
    },
    neur: {
      calm: "https://hebbkx1anhila5yf.public.blob.vercel-storage.com/neur_CALM-zumu12LOmgtYAQ5mquXc38DiM8m4Bl.png",
      angry: "https://hebbkx1anhila5yf.public.blob.vercel-storage.com/neur_ANGRY-1sqcEjKoQ9bL5A8rdwhcN48NMjXJfo.png",
      rebellious:
        "https://hebbkx1anhila5yf.public.blob.vercel-storage.com/neur_REBEL-Gizvzs094llOzj3EsDPx0Y0eYkoxDD.png",
    },
    pred: {
      calm: "https://hebbkx1anhila5yf.public.blob.vercel-storage.com/pred_CALM-emS7EKXcBOma59kVTxzGFUFnGBaXu2.png",
      angry: "https://hebbkx1anhila5yf.public.blob.vercel-storage.com/pred_ANGRY-FLkkwIDKB9gHn7PKKwUESeYyhi8FFE.png",
      rebellious:
        "https://hebbkx1anhila5yf.public.blob.vercel-storage.com/pred_rebel-nIJPaWnP0Hcfp65KP3rBLzQYkQ3uP4.png",
    },
    xeno: {
      calm: "https://hebbkx1anhila5yf.public.blob.vercel-storage.com/xeno_CALM-oP9REsZh9Kt6QSJRdHN5AtIAZhbZWY.png",
      angry: "https://hebbkx1anhila5yf.public.blob.vercel-storage.com/xeno_ANGRY-UZEb9bPYK4Pr8WfNzCZNThvXvs9aX5.png",
      rebellious:
        "https://hebbkx1anhila5yf.public.blob.vercel-storage.com/xeno_REBEL-jwAm6VduKN7zGULlBbxoY9CaR0ggf0.png",
    },
    split: {
      calm: "https://hebbkx1anhila5yf.public.blob.vercel-storage.com/split_CALM-W5Zop4oGcZHg0d2LDu2fupxEL9GTgP.png",
      angry: "https://hebbkx1anhila5yf.public.blob.vercel-storage.com/spit_ANGRY-pIo4B3IkaQ3gCFAftmwPjmZaEO7Ohg.png",
      rebellious:
        "https://hebbkx1anhila5yf.public.blob.vercel-storage.com/spit_REBEL-rOMkcNXsOjFJeAhNfIuLTBlfjhz5WS.png",
    },
  }

  return (
    imageMap[speciesKey]?.[statusKey] ||
    imageMap[speciesKey]?.calm ||
    "https://hebbkx1anhila5yf.public.blob.vercel-storage.com/neur_CALM-zumu12LOmgtYAQ5mquXc38DiM8m4Bl.png"
  )
}

const getRarityColor = (rarity: string) => {
  switch (rarity) {
    case "Common":
      return "bg-muted text-foreground"
    case "Rare":
      return "bg-accent text-accent-foreground"
    case "Epic":
      return "bg-primary text-primary-foreground"
    case "Legendary":
      return "bg-destructive text-destructive-foreground"
    default:
      return "bg-muted text-foreground"
  }
}

const getStatusColor = (status: string) => {
  switch (status) {
    case "CALM":
      return "text-primary"
    case "ANGRY":
      return "text-destructive"
    case "REBELLIOUS":
      return "text-secondary"
    default:
      return "text-foreground"
  }
}

const getStatusBadgeColor = (status: string) => {
  switch (status) {
    case "CALM":
      return "bg-primary text-primary-foreground"
    case "ANGRY":
      return "bg-destructive text-destructive-foreground"
    case "REBELLIOUS":
      return "bg-secondary text-secondary-foreground"
    default:
      return "bg-muted text-foreground"
  }
}

const CreatePetModal = ({
  isOpen,
  onClose,
  onCreatePet,
}: {
  isOpen: boolean
  onClose: () => void
  onCreatePet: (name: string, species: string) => void
}) => {
  const [selectedSpecies, setSelectedSpecies] = useState("")
  const [petName, setPetName] = useState("")

  if (!isOpen) return null

  const handleCreate = () => {
    if (petName && selectedSpecies) {
      onCreatePet(petName, selectedSpecies)
      setPetName("")
      setSelectedSpecies("")
      onClose()
    }
  }

  return (
    <div className="fixed inset-0 bg-black/80 flex items-center justify-center z-50">
      <div className="alien-card bg-card p-8 max-w-md w-full mx-4">
        <h3 className="text-2xl font-bold retro-text text-primary alien-glow mb-6 text-center">► CREATE NEW PET ◄</h3>

        <div className="space-y-6">
          <div>
            <label className="retro-text text-foreground text-sm mb-2 block">► PET_NAME:</label>
            <input
              type="text"
              value={petName}
              onChange={(e) => setPetName(e.target.value)}
              placeholder="ENTER_NAME"
              className="w-full bg-input border-2 border-primary focus:border-accent retro-text font-mono text-sm p-3"
            />
          </div>

          <div>
            <label className="retro-text text-foreground text-sm mb-2 block">► SELECT_SPECIES:</label>
            <div className="grid grid-cols-1 gap-3">
              {ALIEN_SPECIES.map((species) => (
                <button
                  key={species.id}
                  onClick={() => setSelectedSpecies(species.id)}
                  className={`alien-card p-4 text-left transition-all ${
                    selectedSpecies === species.id ? "border-accent bg-accent/20" : ""
                  }`}
                >
                  <div className="flex items-center space-x-3">
                    <span className="text-2xl">{species.icon}</span>
                    <div>
                      <div className="retro-text text-foreground font-bold">{species.name}</div>
                      <Badge className={`text-xs retro-text ${getRarityColor(species.rarity)}`}>
                        {species.rarity.toUpperCase()}
                      </Badge>
                    </div>
                  </div>
                </button>
              ))}
            </div>
          </div>

          <div className="flex space-x-4">
            <Button onClick={handleCreate} className="alien-button flex-1" disabled={!petName || !selectedSpecies}>
              ► CREATE ◄
            </Button>
            <Button onClick={onClose} className="alien-button flex-1 bg-destructive border-destructive">
              ► CANCEL ◄
            </Button>
          </div>
        </div>
      </div>
    </div>
  )
}

export default function Dashboard() {
  const [pets, setPets] = useState<PetResponseDTO[]>([])
  const [selectedPet, setSelectedPet] = useState<PetResponseDTO | null>(null)
  const [showCreateModal, setShowCreateModal] = useState(false)
  const [user, setUser] = useState<UserResponseDTO | null>(null)
  const [token, setToken] = useState<string | null>(null)

  // 🔥 carreguem el token un sol cop al muntar el component
  useEffect(() => {
    const savedToken = localStorage.getItem("token")
    if (savedToken) {
      setToken(savedToken)
    }
  }, [])

  const hasRebelliousPets = pets.some((pet) => pet.status === "REBELLIOUS")

  const playReleaseSound = () => {
    const shotgunAudio = new Audio("/sounds/shotgun.mp3")
    const alienScreamAudio = new Audio("/sounds/alien-scream.mp3")

    shotgunAudio.play().catch((e) => console.log("Audio play failed:", e))

    setTimeout(() => {
      alienScreamAudio.play().catch((e) =>
        console.log("Audio play failed:", e)
      )
    }, 200)
  }

  const fetchUser = async () => {
    if (!token) return
    const res = await fetch("http://localhost:8080/auth/me", {
      headers: { Authorization: `Bearer ${token}` },
    })
    if (res.ok) {
      const data = await res.json()
      setUser(data)

      if (data.email === "admin@virtualpet.com" || data.username === "admin") {
        console.log("[v0] Admin detected, redirecting to admin dashboard")
        window.location.href = "/admin"
        return
      }
    }
  }

  const fetchPets = async () => {
    if (!token) return
    const res = await fetch("http://localhost:8080/api/pets", {
      headers: { Authorization: `Bearer ${token}` },
    })
    if (res.ok) {
      const data = await res.json()
      setPets(data)
      if (data.length > 0 && !selectedPet) {
        setSelectedPet(data[0])
      } else if (selectedPet) {
        const updatedSelectedPet = data.find(
          (pet: PetResponseDTO) => pet.id === selectedPet.id
        )
        if (updatedSelectedPet) {
          setSelectedPet(updatedSelectedPet)
        } else if (data.length > 0) {
          setSelectedPet(data[0])
        }
      }
    }
  }

  useEffect(() => {
    if (token) {
      fetchUser().then(fetchPets)
    }
  }, [token])


    const handleAction = async (petId: number, action: string) => {
      if (!token) return
      let url = `http://localhost:8080/api/pets/${petId}/${action}`
      let method = "POST"
      if (action === "release") {
        playReleaseSound()
        url = `http://localhost:8080/api/pets/${petId}?forced=true`
        method = "DELETE"
      }
      const res = await fetch(url, {
        method,
        headers: { Authorization: `Bearer ${token}` },
      })
      if (res.ok) fetchPets()
    }

    const handleCreatePet = async (name: string, species: string) => {
      if (!user || !token) return

      const res = await fetch(`http://localhost:8080/api/pets/${user.id}`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({ name, species, hunger: 0, aggressiveness: 0 }),
      })
      if (res.ok) {
        await fetchPets()
      }
    }

  return (
    <div className="min-h-screen bg-background relative overflow-hidden">
      {hasRebelliousPets && (
        <div className="fixed inset-0 z-50 pointer-events-none">
          <div className="absolute inset-0 bg-red-500/20 animate-pulse" />
          <div className="absolute inset-0 bg-red-600/10 animate-ping" />
          <div className="absolute top-4 left-1/2 transform -translate-x-1/2 z-60">
            <div className="bg-red-900/90 border-2 border-red-500 rounded-lg p-2 sm:p-3 md:p-4 animate-bounce mx-2 max-w-xs sm:max-w-sm md:max-w-md lg:max-w-lg">
              <div className="text-red-400 text-xs sm:text-sm md:text-base lg:text-lg font-bold text-center font-mono animate-pulse">
                ⚠️ CONTAINMENT BREACH ALERT ⚠️
              </div>
              <div className="text-red-300 text-xs sm:text-sm md:text-sm text-center font-mono mt-1">
                REBELLIOUS SPECIMEN DETECTED - IMMEDIATE RELEASE REQUIRED
              </div>
            </div>
          </div>
        </div>
      )}

      <div
        className="fixed inset-0 z-0"
        style={{
          backgroundImage: "url('/space-lab-background.jpg')",
          backgroundSize: "cover",
          backgroundPosition: "center",
          backgroundRepeat: "no-repeat",
          imageRendering: "pixelated",
        }}
      />

      {/* Alien slime drips effect */}
      <div className="fixed inset-0 z-1 pointer-events-none">
        <div
          className={`alien-slime-drip ${hasRebelliousPets ? "rebellious-slime" : ""}`}
          style={{ left: "5%", animationDelay: "0s" }}
        ></div>
        <div
          className={`alien-slime-drip ${hasRebelliousPets ? "rebellious-slime" : ""}`}
          style={{ left: "15%", animationDelay: "2s" }}
        ></div>
        <div
          className={`alien-slime-drip ${hasRebelliousPets ? "rebellious-slime" : ""}`}
          style={{ left: "25%", animationDelay: "4s" }}
        ></div>
        <div
          className={`alien-slime-drip ${hasRebelliousPets ? "rebellious-slime" : ""}`}
          style={{ left: "35%", animationDelay: "1s" }}
        ></div>
        <div
          className={`alien-slime-drip ${hasRebelliousPets ? "rebellious-slime" : ""}`}
          style={{ left: "45%", animationDelay: "3s" }}
        ></div>
        <div
          className={`alien-slime-drip ${hasRebelliousPets ? "rebellious-slime" : ""}`}
          style={{ left: "55%", animationDelay: "5s" }}
        ></div>
        <div
          className={`alien-slime-drip ${hasRebelliousPets ? "rebellious-slime" : ""}`}
          style={{ left: "65%", animationDelay: "2.5s" }}
        ></div>
        <div
          className={`alien-slime-drip ${hasRebelliousPets ? "rebellious-slime" : ""}`}
          style={{ left: "75%", animationDelay: "4.5s" }}
        ></div>
        <div
          className={`alien-slime-drip ${hasRebelliousPets ? "rebellious-slime" : ""}`}
          style={{ left: "85%", animationDelay: "1.5s" }}
        ></div>
        <div
          className={`alien-slime-drip ${hasRebelliousPets ? "rebellious-slime" : ""}`}
          style={{ left: "95%", animationDelay: "3.5s" }}
        ></div>
      </div>

      <div className="fixed inset-0 bg-black/40 z-2" />

      <div className="fixed bottom-2 sm:bottom-4 md:bottom-6 lg:bottom-8 left-2 sm:left-4 md:left-6 lg:left-8 z-20 max-w-xs sm:max-w-sm md:max-w-md">
        <div className="relative">
          <div
            className={`${hasRebelliousPets ? "bg-red-900/90 border-red-400" : "bg-green-900/90 border-green-400"} border-2 rounded-lg p-2 sm:p-3 md:p-4 mb-2 relative`}
          >
            <div
              className={`${hasRebelliousPets ? "text-red-400" : "text-green-400"} text-xs sm:text-sm font-bold mb-1 font-mono`}
            >
              COMMANDER SUBIRACHS
            </div>
            <div
              className={`${hasRebelliousPets ? "text-red-300" : "text-green-300"} text-xs sm:text-sm leading-tight font-mono`}
            >
              {hasRebelliousPets
                ? "⚠️ CRITICAL ALERT! Rebellious specimen detected! Release immediately to prevent facility breach!"
                : "Monitor your specimens carefully. Only CALM aliens can be captured. Feed and play with them to prevent rebellion. REBELLIOUS specimens must be released immediately."}
            </div>
            <div
              className={`absolute bottom-[-8px] left-6 w-0 h-0 border-l-[8px] border-l-transparent border-r-[8px] border-r-transparent border-t-[8px] ${hasRebelliousPets ? "border-t-red-400" : "border-t-green-400"}`}
            ></div>
          </div>
          <img
            src="/commander.png"
            alt="Commander"
            className={`w-12 h-12 sm:w-16 sm:h-16 md:w-20 md:h-20 lg:w-24 lg:h-24 pixelated border-2 ${hasRebelliousPets ? "border-red-400" : "border-green-400"} rounded bg-black/50`}
          />
        </div>
      </div>

      <header
        className={`border-b-2 ${hasRebelliousPets ? "border-red-500 bg-red-900/20" : "border-primary bg-card/90"} backdrop-blur-sm relative z-10`}
      >
        <div className="container mx-auto px-3 sm:px-4 md:px-6 lg:px-8 xl:px-12 py-3 sm:py-4 md:py-5 lg:py-6 flex items-center justify-between">
          <div className="flex items-center space-x-3 sm:space-x-4 md:space-x-5 lg:space-x-6">
            <Bug
              className={`h-7 w-7 sm:h-8 sm:w-8 md:h-10 md:w-10 lg:h-12 lg:w-12 xl:h-14 xl:w-14 ${hasRebelliousPets ? "text-red-500" : "text-primary"} alien-glow pixel-art`}
            />
            <div>
              <h1
                className={`text-base sm:text-lg md:text-xl lg:text-2xl xl:text-3xl 2xl:text-4xl font-bold pixel-title-enhanced ${hasRebelliousPets ? "text-red-400" : ""}`}
              >
                {hasRebelliousPets ? "⚠️ BREACH ⚠️" : "◄ SPACE LAB ►"}
              </h1>
              <p
                className={`text-xs sm:text-sm md:text-base lg:text-lg xl:text-xl pixel-subtitle ${hasRebelliousPets ? "text-red-300" : "text-foreground"}`}
              >
                <span className="hidden md:inline">ALIEN RESEARCH FACILITY - </span>
                {user?.username || "LOADING..."}
              </p>
            </div>
          </div>

          <div className="flex items-center space-x-2 sm:space-x-3 md:space-x-4">
            <Button
              className="pixel-button text-xs sm:text-sm md:text-base lg:text-lg px-3 sm:px-4 md:px-5 lg:px-6 py-2 sm:py-2.5 md:py-3"
              onClick={() => (window.location.href = "/")}
            >
              <LogOut className="h-3 w-3 sm:h-4 sm:w-4 md:h-5 md:w-5 lg:h-6 lg:w-6 mr-1 sm:mr-2" />
              <span className="hidden sm:inline">EXIT LAB</span>
              <span className="sm:hidden">EXIT</span>
            </Button>
          </div>
        </div>
      </header>

      <main className="container mx-auto px-3 sm:px-4 md:px-6 lg:px-8 xl:px-12 py-4 sm:py-6 md:py-8 lg:py-10 xl:py-12 relative z-10">
        {pets.length === 0 ? (
          <div className="pixel-card p-6 sm:p-8 md:p-10 lg:p-12 xl:p-16 text-center">
            <h2 className="pixel-title-enhanced text-xl sm:text-2xl md:text-3xl lg:text-4xl xl:text-5xl mb-4 sm:mb-6 md:mb-8">
              ► NO SPECIMENS DETECTED ◄
            </h2>
            <p className="pixel-title text-base sm:text-lg md:text-xl lg:text-2xl xl:text-3xl text-primary mb-6 sm:mb-8 md:mb-10">
              Welcome Commander {user?.username}, no specimens in your lab yet.
            </p>
            <Button
              className="pixel-button text-sm sm:text-base md:text-lg lg:text-xl px-6 sm:px-8 md:px-10 lg:px-12 py-3 sm:py-4 md:py-5"
              onClick={() => setShowCreateModal(true)}
            >
              <Plus className="h-4 w-4 sm:h-5 sm:w-5 md:h-6 md:h-6 lg:h-7 lg:w-7 mr-2 sm:mr-3" />
              CAPTURE NEW SPECIMEN
            </Button>
          </div>
        ) : (
          <div className="grid grid-cols-1 lg:grid-cols-2 xl:grid-cols-3 2xl:grid-cols-3 gap-4 sm:gap-6 md:gap-8 lg:gap-10 xl:gap-12">
            <div className="lg:col-span-1 space-y-4 sm:space-y-6 md:space-y-8">
              <div className="flex items-center justify-between">
                <h2 className="text-xl sm:text-2xl md:text-3xl lg:text-4xl xl:text-5xl font-bold pixel-title-enhanced">
                  ► SPECIMENS ◄
                </h2>
                <Button
                  className="pixel-button text-xs sm:text-sm md:text-base lg:text-lg px-3 sm:px-4 md:px-5 lg:px-6 py-2 sm:py-2.5 md:py-3"
                  onClick={() => setShowCreateModal(true)}
                >
                  <Plus className="h-3 w-3 sm:h-4 sm:w-4 md:h-5 md:w-5 lg:h-6 lg:w-6 mr-1 sm:mr-2" />
                  <span className="hidden sm:inline">CAPTURE</span>
                  <span className="sm:hidden">+</span>
                </Button>
              </div>

              <div className="space-y-3 sm:space-y-4 md:space-y-5 lg:space-y-6">
                {pets.map((pet) => (
                  <div
                    key={pet.id}
                    className={`pixel-card cursor-pointer transition-all p-3 sm:p-4 md:p-5 lg:p-6 ${
                      selectedPet?.id === pet.id ? "border-accent bg-accent/20" : ""
                    }`}
                    onClick={() => setSelectedPet(pet)}
                  >
                    <div className="flex items-center space-x-3 sm:space-x-4 md:space-x-5 lg:space-x-6">
                      <img
                        src={getAlienImage(pet.species, pet.status) || "/placeholder.svg"}
                        alt={pet.name}
                        className="w-12 h-12 sm:w-14 sm:h-14 md:w-16 md:h-16 lg:w-20 lg:h-20 xl:w-24 xl:h-24 pixel-render"
                      />
                      <div className="flex-1 min-w-0">
                        <div className="flex items-center space-x-2 sm:space-x-3 mb-1 sm:mb-2">
                          <h3 className="font-bold pixel-title text-foreground truncate text-sm sm:text-base md:text-lg lg:text-xl xl:text-2xl">
                            ► {pet.name} ◄
                          </h3>
                          <Badge className={`text-xs sm:text-sm md:text-base pixel-title ${getRarityColor("Epic")}`}>
                            LV.{pet.level}
                          </Badge>
                        </div>
                        <p className="text-xs sm:text-sm md:text-base lg:text-lg pixel-title text-foreground truncate">
                          {pet.species}
                        </p>
                        <div className="flex items-center space-x-2 sm:space-x-3 mt-2">
                          <Badge
                            className={`text-xs sm:text-sm md:text-base pixel-title ${getStatusBadgeColor(pet.status)}`}
                          >
                            {pet.status}
                          </Badge>
                        </div>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {selectedPet && (
              <div className="lg:col-span-1 xl:col-span-2 space-y-6 sm:space-y-8 md:space-y-10 lg:space-y-12">
                <div className="pixel-card p-4 sm:p-6 md:p-8 lg:p-10 xl:p-12">
                  <div className="flex flex-col sm:flex-row sm:items-center justify-between mb-6 sm:mb-8 md:mb-10 lg:mb-12 space-y-4 sm:space-y-0">
                    <div>
                      <h3 className="text-2xl sm:text-3xl md:text-4xl lg:text-5xl xl:text-6xl font-bold pixel-title-enhanced mb-2 sm:mb-3">
                        ► {selectedPet.name} ◄
                      </h3>
                      <p className="text-sm sm:text-base md:text-lg lg:text-xl xl:text-2xl pixel-title text-foreground">
                        {selectedPet.species} • LEVEL {selectedPet.level}
                      </p>
                    </div>
                    <div className="flex flex-row sm:flex-col items-start sm:items-end space-x-3 sm:space-x-0 sm:space-y-3">
                      <Badge
                        className={`bg-primary text-primary-foreground text-xs sm:text-sm md:text-base lg:text-lg px-3 sm:px-4 md:px-5 py-1.5 sm:py-2 md:py-2.5 pixel-title`}
                      >
                        LEVEL {selectedPet.level}
                      </Badge>
                      <Badge
                        className={`${getStatusBadgeColor(selectedPet.status)} text-xs sm:text-sm md:text-base lg:text-lg px-3 sm:px-4 md:px-5 py-1.5 sm:py-2 md:py-2.5 pixel-title`}
                      >
                        {selectedPet.status}
                      </Badge>
                    </div>
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6 sm:gap-8 md:gap-10 lg:gap-12">
                    <div className="text-center">
                      <div className="relative">
                        <div className="w-40 h-40 sm:w-48 sm:h-48 md:w-56 md:h-56 lg:w-64 lg:h-64 xl:w-72 xl:h-72 2xl:w-80 2xl:h-80 mx-auto rounded border-4 border-primary alien-glow bg-card/50 flex items-center justify-center relative overflow-hidden">
                          <img
                            src={getAlienImage(selectedPet.species, selectedPet.status) || "/placeholder.svg"}
                            alt={selectedPet.name}
                            className="w-36 h-36 sm:w-44 sm:h-44 md:w-52 md:h-52 lg:w-60 lg:h-60 xl:w-68 xl:h-68 2xl:w-76 2xl:h-76 pixel-render floating-element"
                          />
                          <div className="absolute inset-0 border-2 border-primary/30 rounded animate-pulse" />
                        </div>
                        <div className="absolute -top-2 -right-2 bg-accent text-accent-foreground px-3 sm:px-4 md:px-5 py-1.5 sm:py-2 rounded pixel-title text-sm sm:text-base md:text-lg">
                          LV.{selectedPet.level}
                        </div>
                      </div>
                      <p
                        className={`mt-4 sm:mt-6 text-lg sm:text-xl md:text-2xl lg:text-3xl xl:text-4xl font-bold pixel-title ${getStatusColor(selectedPet.status)}`}
                      >
                        ► {selectedPet.status} ◄
                      </p>
                      <div className="pixel-card p-3 sm:p-4 md:p-5 lg:p-6 mt-4 sm:mt-6 text-left">
                        <h5 className="pixel-title font-bold text-primary mb-3 sm:mb-4 text-sm sm:text-base md:text-lg lg:text-xl">
                          ► SPECIES DATA ◄
                        </h5>
                        <p className="pixel-title text-foreground text-xs sm:text-sm md:text-base lg:text-lg mb-4 sm:mb-5">
                          {SPECIES_INFO[selectedPet.species as keyof typeof SPECIES_INFO]?.description}
                        </p>
                        <div className="space-y-3 sm:space-y-4">
                          <div>
                            <span className="pixel-title text-accent text-xs sm:text-sm md:text-base lg:text-lg font-bold">
                              ORIGIN:{" "}
                            </span>
                            <span className="pixel-title text-foreground text-xs sm:text-sm md:text-base lg:text-lg">
                              {SPECIES_INFO[selectedPet.species as keyof typeof SPECIES_INFO]?.origin}
                            </span>
                          </div>
                          <div>
                            <span className="pixel-title text-accent text-xs sm:text-sm md:text-base lg:text-lg font-bold">
                              TRAITS:{" "}
                            </span>
                            <div className="flex flex-wrap gap-1.5 sm:gap-2 mt-2">
                              {SPECIES_INFO[selectedPet.species as keyof typeof SPECIES_INFO]?.traits.map(
                                (trait, index) => (
                                  <Badge
                                    key={index}
                                    className="bg-primary/20 text-primary text-xs sm:text-sm md:text-base pixel-title"
                                  >
                                    {trait}
                                  </Badge>
                                ),
                              )}
                            </div>
                          </div>
                          <div>
                            <span className="pixel-title text-accent text-xs sm:text-sm md:text-base lg:text-lg font-bold">
                              CARE:{" "}
                            </span>
                            <span className="pixel-title text-foreground text-xs sm:text-sm md:text-base lg:text-lg">
                              {SPECIES_INFO[selectedPet.species as keyof typeof SPECIES_INFO]?.care}
                            </span>
                          </div>
                        </div>
                      </div>
                    </div>

                    <div className="space-y-4 sm:space-y-6 md:space-y-8">
                      <div className="pixel-card p-3 sm:p-4 md:p-5 lg:p-6">
                        <div className="flex items-center justify-between mb-3 sm:mb-4">
                          <div className="flex items-center space-x-2 sm:space-x-3">
                            <Apple className="h-4 w-4 sm:h-5 sm:w-5 md:h-6 md:w-6 lg:h-7 lg:w-7 text-destructive alien-glow" />
                            <span className="pixel-title font-bold text-destructive text-sm sm:text-base md:text-lg lg:text-xl">
                              HUNGER
                            </span>
                          </div>
                          <span className="pixel-title text-destructive font-bold text-sm sm:text-base md:text-lg lg:text-xl">
                            {selectedPet.hunger}%
                          </span>
                        </div>
                        <Progress
                          value={selectedPet.hunger}
                          className="h-3 sm:h-4 md:h-5 lg:h-6 bg-background border border-destructive"
                        />
                      </div>

                      <div className="pixel-card p-3 sm:p-4 md:p-5 lg:p-6">
                        <div className="flex items-center justify-between mb-3 sm:mb-4">
                          <div className="flex items-center space-x-2 sm:space-x-3">
                            <Zap className="h-4 w-4 sm:h-5 sm:w-5 md:h-6 md:w-6 lg:h-7 lg:w-7 text-accent alien-glow" />
                            <span className="pixel-title font-bold text-accent text-sm sm:text-base md:text-lg lg:text-xl">
                              AGGRESSIVENESS
                            </span>
                          </div>
                          <span className="pixel-title text-accent font-bold text-sm sm:text-base md:text-lg lg:text-xl">
                            {selectedPet.aggressiveness}%
                          </span>
                        </div>
                        <Progress
                          value={selectedPet.aggressiveness}
                          className="h-3 sm:h-4 md:h-5 lg:h-6 bg-background border border-accent"
                        />
                      </div>

                      <div className="pixel-card p-3 sm:p-4 md:p-5 lg:p-6">
                        <div className="flex items-center justify-between mb-3 sm:mb-4">
                          <div className="flex items-center space-x-2 sm:space-x-3">
                            <Star className="h-4 w-4 sm:h-5 sm:w-5 md:h-6 md:w-6 lg:h-7 lg:w-7 text-primary alien-glow" />
                            <span className="pixel-title font-bold text-primary text-sm sm:text-base md:text-lg lg:text-xl">
                              LEVEL
                            </span>
                          </div>
                          <span className="pixel-title text-primary font-bold text-sm sm:text-base md:text-lg lg:text-xl">
                            {selectedPet.level}
                          </span>
                        </div>
                        <div className="h-3 sm:h-4 md:h-5 lg:h-6 bg-background border border-primary rounded-full overflow-hidden">
                          <div
                            className="h-full bg-primary transition-all duration-300"
                            style={{ width: `${Math.min(100, (selectedPet.level % 10) * 10)}%` }}
                          />
                        </div>
                      </div>
                    </div>
                  </div>

                  <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 sm:gap-4 md:gap-5 lg:gap-6 mt-6 sm:mt-8 md:mt-10 lg:mt-12">
                    <Button
                      onClick={() => handleAction(selectedPet.id, "feed")}
                      className="pixel-button text-xs sm:text-sm md:text-base lg:text-lg px-3 sm:px-4 md:px-5 py-2 sm:py-2.5 md:py-3"
                    >
                      <Apple className="h-3 w-3 sm:h-4 sm:w-4 md:h-5 md:w-5 lg:h-6 lg:w-6 mr-1 sm:mr-2" />
                      <span className="hidden sm:inline">FEED</span>
                      <span className="sm:hidden">🍎</span>
                    </Button>
                    <Button
                      onClick={() => handleAction(selectedPet.id, "play")}
                      className="pixel-button text-xs sm:text-sm md:text-base lg:text-lg px-3 sm:px-4 md:px-5 py-2 sm:py-2.5 md:py-3"
                    >
                      <Gamepad2 className="h-3 w-3 sm:h-4 sm:w-4 md:h-5 md:w-5 lg:h-6 lg:w-6 mr-1 sm:mr-2" />
                      <span className="hidden sm:inline">PLAY</span>
                      <span className="sm:hidden">🎮</span>
                    </Button>
                    <Button
                      onClick={() => handleAction(selectedPet.id, "train")}
                      className="pixel-button text-xs sm:text-sm md:text-base lg:text-lg px-3 sm:px-4 md:px-5 py-2 sm:py-2.5 md:py-3"
                    >
                      <Target className="h-3 w-3 sm:h-4 sm:w-4 md:h-5 md:w-5 lg:h-6 lg:w-6 mr-1 sm:mr-2" />
                      <span className="hidden sm:inline">TRAIN</span>
                      <span className="sm:hidden">🎯</span>
                    </Button>
                    <Button
                      onClick={() => handleAction(selectedPet.id, "release")}
                      className="pixel-button bg-destructive border-destructive text-xs sm:text-sm md:text-base lg:text-lg px-3 sm:px-4 md:px-5 py-2 sm:py-2.5 md:py-3"
                    >
                      <Skull className="h-3 w-3 sm:h-4 sm:w-4 md:h-5 md:w-5 lg:h-6 lg:w-6 mr-1 sm:mr-2" />
                      <span className="hidden sm:inline">RELEASE</span>
                      <span className="sm:hidden">💀</span>
                    </Button>
                  </div>
                </div>

                <div className="pixel-card p-4 sm:p-6 md:p-8 lg:p-10">
                  <h4 className="text-lg sm:text-xl md:text-2xl lg:text-3xl xl:text-4xl font-bold pixel-title-enhanced text-center mb-4 sm:mb-6 md:mb-8">
                    ► STATUS LOGIC ◄
                  </h4>
                  <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 sm:gap-4 md:gap-6 lg:gap-8 text-center">
                    <div className="pixel-card p-3 sm:p-4 md:p-5 lg:p-6">
                      <Badge className="bg-primary text-primary-foreground mb-3 sm:mb-4 text-xs sm:text-sm md:text-base lg:text-lg">
                        CALM
                      </Badge>
                      <p className="pixel-title text-foreground text-xs sm:text-sm md:text-base lg:text-lg">
                        Hunger &lt; 50% AND Aggressiveness &lt; 50%
                      </p>
                    </div>
                    <div className="pixel-card p-3 sm:p-4 md:p-5 lg:p-6">
                      <Badge className="bg-destructive text-destructive-foreground mb-3 sm:mb-4 text-xs sm:text-sm md:text-base lg:text-lg">
                        ANGRY
                      </Badge>
                      <p className="pixel-title text-foreground text-xs sm:text-sm md:text-base lg:text-lg">
                        Hunger ≥ 50% OR Aggressiveness ≥ 50%
                      </p>
                    </div>
                    <div className="pixel-card p-3 sm:p-4 md:p-5 lg:p-6">
                      <Badge className="bg-secondary text-secondary-foreground mb-3 sm:mb-4 text-xs sm:text-sm md:text-base lg:text-lg">
                        REBELLIOUS
                      </Badge>
                      <p className="pixel-title text-foreground text-xs sm:text-sm md:text-base lg:text-lg">
                        Hunger ≥ 80% OR Aggressiveness ≥ 80%
                      </p>
                    </div>
                  </div>
                </div>
              </div>
            )}
          </div>
        )}
      </main>

      <CreatePetModal
        isOpen={showCreateModal}
        onClose={() => setShowCreateModal(false)}
        onCreatePet={handleCreatePet}
      />
    </div>
  )
}
