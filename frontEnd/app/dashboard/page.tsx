"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Progress } from "@/components/ui/progress"
import { Zap, Gamepad2, Apple, Star, LogOut, Plus, Bug, Skull, Target } from "lucide-react"

const ALIEN_SPECIES = [
  { id: "FACEHUGGER", name: "FACEHUGGER", icon: "🕷️", rarity: "Rare" },
  { id: "NEUROMANCER", name: "NEUROMANCER", icon: "🧠", rarity: "Epic" },
  { id: "PREDATOR", name: "PREDATOR", icon: "🦾", rarity: "Legendary" },
  { id: "XENOMORPH", name: "XENOMORPH", icon: "👽", rarity: "Legendary" },
  { id: "ACIDSPITTER", name: "ACIDSPITTER", icon: "🐙", rarity: "Epic" },
]

const mockPets = [
  {
    id: 1,
    name: "XX-121",
    species: "XENOMORPH",
    level: 15,
    hunger: 25,
    aggressiveness: 30,
    status: "CALM",
    lastFedAt: "2024-01-15T10:30:00",
    lastInteractedAt: "2024-01-15T11:00:00",
  },
  {
    id: 2,
    name: "YAUTJA-7",
    species: "PREDATOR",
    level: 23,
    hunger: 60,
    aggressiveness: 45,
    status: "ANGRY",
    lastFedAt: "2024-01-15T08:00:00",
    lastInteractedAt: "2024-01-15T09:30:00",
  },
  {
    id: 3,
    name: "HUGGER-3",
    species: "FACEHUGGER",
    level: 8,
    hunger: 85,
    aggressiveness: 75,
    status: "REBELLIOUS",
    lastFedAt: "2024-01-15T06:00:00",
    lastInteractedAt: "2024-01-15T07:00:00",
  },
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

const getSpeciesIcon = (species: string) => {
  const speciesData = ALIEN_SPECIES.find((s) => s.id === species)
  return speciesData?.icon || "👽"
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

const calculateStatus = (hunger: number, aggressiveness: number): string => {
  if (aggressiveness >= 80 || hunger >= 80) {
    return "REBELLIOUS"
  } else if (aggressiveness >= 50 || hunger >= 50) {
    return "ANGRY"
  } else {
    return "CALM"
  }
}

const formatLastActivity = (dateString: string): string => {
  const date = new Date(dateString)
  const now = new Date()
  const diffMs = now.getTime() - date.getTime()
  const diffHours = Math.floor(diffMs / (1000 * 60 * 60))
  const diffMinutes = Math.floor((diffMs % (1000 * 60 * 60)) / (1000 * 60))

  if (diffHours > 0) {
    return `${diffHours}H ${diffMinutes}M AGO`
  } else {
    return `${diffMinutes}M AGO`
  }
}

const CreatePetModal = ({ isOpen, onClose }: { isOpen: boolean; onClose: () => void }) => {
  const [selectedSpecies, setSelectedSpecies] = useState("")
  const [petName, setPetName] = useState("")

  if (!isOpen) return null

  const handleCreate = () => {
    console.log("Creating pet:", { name: petName, species: selectedSpecies })
    // Aquí conectarías con tu API para crear la mascota
    onClose()
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
  const [selectedPet, setSelectedPet] = useState(mockPets[0])
  const [showCreateModal, setShowCreateModal] = useState(false)
  const [user] = useState({
    username: "RIPLEY_2179",
    level: 12,
    totalPets: mockPets.length,
  })

  const feedPet = (petId: number) => {
    console.log(`[v0] Feeding pet ${petId} - reduces hunger by 20`)
    // POST /api/pets/${petId}/feed
    // Backend: pet.setHunger(Math.max(0, pet.getHunger() - 20))
  }

  const playWithPet = (petId: number) => {
    console.log(`[v0] Playing with pet ${petId} - reduces aggressiveness by 15, increases level by 1`)
    // POST /api/pets/${petId}/play
    // Backend: pet.setAggressiveness(Math.max(0, pet.getAggressiveness() - 15))
    // Backend: pet.setLevel(pet.getLevel() + 1)
  }

  const trainPet = (petId: number) => {
    console.log(`[v0] Training pet ${petId} - increases level by 2, increases aggressiveness by 10`)
    // POST /api/pets/${petId}/train
    // Backend: pet.setLevel(pet.getLevel() + 2)
    // Backend: pet.setAggressiveness(Math.min(100, pet.getAggressiveness() + 10))
  }

  const healPet = (petId: number) => {
    console.log(`[v0] Healing pet ${petId}`)
    // POST /api/pets/${petId}/heal
  }

  const deletePet = (petId: number) => {
    const pet = mockPets.find((p) => p.id === petId)
    const currentStatus = pet ? calculateStatus(pet.hunger, pet.aggressiveness) : "CALM"

    if (currentStatus === "REBELLIOUS") {
      console.log(`[v0] Releasing pet ${petId} - status is REBELLIOUS, deletion allowed`)
      // DELETE /api/pets/${petId}?forced=false
    } else {
      console.log(`[v0] Cannot release pet ${petId} - status is ${currentStatus}, not REBELLIOUS`)
      alert("Pet is not rebellious enough to be released safely!")
    }
  }

  return (
    <div className="min-h-screen bg-background relative overflow-hidden">
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
        {/* Multiple slime drips with different positions and animation delays */}
        <div className="alien-slime-drip" style={{ left: "5%", animationDelay: "0s" }}></div>
        <div className="alien-slime-drip" style={{ left: "15%", animationDelay: "2s" }}></div>
        <div className="alien-slime-drip" style={{ left: "25%", animationDelay: "4s" }}></div>
        <div className="alien-slime-drip" style={{ left: "35%", animationDelay: "1s" }}></div>
        <div className="alien-slime-drip" style={{ left: "45%", animationDelay: "3s" }}></div>
        <div className="alien-slime-drip" style={{ left: "55%", animationDelay: "5s" }}></div>
        <div className="alien-slime-drip" style={{ left: "65%", animationDelay: "2.5s" }}></div>
        <div className="alien-slime-drip" style={{ left: "75%", animationDelay: "4.5s" }}></div>
        <div className="alien-slime-drip" style={{ left: "85%", animationDelay: "1.5s" }}></div>
        <div className="alien-slime-drip" style={{ left: "95%", animationDelay: "3.5s" }}></div>
      </div>

      <div className="fixed inset-0 bg-black/40 z-2" />

      <div className="fixed bottom-8 left-8 z-20 max-w-xs">
        <div className="relative">
          {/* Comic speech bubble */}
          <div className="bg-green-900/90 border-2 border-green-400 rounded-lg p-3 mb-2 relative">
            <div className="text-green-400 text-xs font-bold mb-1 font-mono">COMMANDER SUBIRACHS</div>
            <div className="text-green-300 text-xs leading-tight font-mono">
              Monitor your specimens carefully. Only CALM aliens can be captured. Feed and play with them to prevent
              rebellion. REBELLIOUS specimens must be released immediately.
            </div>
            {/* Speech bubble tail pointing to commander */}
            <div className="absolute bottom-[-8px] left-6 w-0 h-0 border-l-[8px] border-l-transparent border-r-[8px] border-r-transparent border-t-[8px] border-t-green-400"></div>
          </div>
          {/* Commander image */}
          <img
            src="/commander.png"
            alt="Commander"
            className="w-24 h-24 pixelated border-2 border-green-400 rounded bg-black/50"
          />
        </div>
      </div>

      <header className="border-b-2 border-primary bg-card/90 backdrop-blur-sm relative z-10">
        <div className="container mx-auto px-4 py-4 flex items-center justify-between">
          <div className="flex items-center space-x-4">
            <Bug className="h-10 w-10 text-primary alien-glow pixel-art" />
            <div>
              <h1 className="text-2xl font-bold pixel-title-enhanced">◄ SPACE LAB ►</h1>
              <p className="text-sm pixel-subtitle text-foreground">ALIEN RESEARCH FACILITY - {user.username}</p>
            </div>
          </div>

          <div className="flex items-center space-x-4">
            <Button className="pixel-button" onClick={() => (window.location.href = "/")}>
              <LogOut className="h-4 w-4 mr-2" />
              EXIT LAB
            </Button>
          </div>
        </div>
      </header>

      <main className="container mx-auto px-4 py-6 relative z-10">
        <div className="grid lg:grid-cols-3 gap-8">
          <div className="lg:col-span-1 space-y-6">
            <div className="flex items-center justify-between">
              <h2 className="text-2xl font-bold pixel-title-enhanced">► SPECIMENS ◄</h2>
              <Button className="pixel-button" onClick={() => setShowCreateModal(true)}>
                <Plus className="h-4 w-4 mr-2" />
                CAPTURE
              </Button>
            </div>

            <div className="space-y-4">
              {mockPets.map((pet) => {
                const currentStatus = calculateStatus(pet.hunger, pet.aggressiveness)
                return (
                  <div
                    key={pet.id}
                    className={`pixel-card cursor-pointer transition-all p-4 ${
                      selectedPet.id === pet.id ? "border-accent bg-accent/20" : ""
                    }`}
                    onClick={() => setSelectedPet(pet)}
                  >
                    <div className="flex items-center space-x-4">
                      <img
                        src={getAlienImage(pet.species, currentStatus) || "/placeholder.svg"}
                        alt={pet.name}
                        className="w-16 h-16 pixel-render"
                      />
                      <div className="flex-1 min-w-0">
                        <div className="flex items-center space-x-2 mb-1">
                          <h3 className="font-bold pixel-title text-foreground truncate">► {pet.name} ◄</h3>
                          <Badge className={`text-xs pixel-title ${getRarityColor("Epic")}`}>LV.{pet.level}</Badge>
                        </div>
                        <p className="text-sm pixel-title text-foreground truncate">{pet.species}</p>
                        <div className="flex items-center space-x-3 mt-2">
                          <Badge className={`text-xs pixel-title ${getStatusBadgeColor(currentStatus)}`}>
                            {currentStatus}
                          </Badge>
                        </div>
                      </div>
                    </div>
                  </div>
                )
              })}
            </div>
          </div>

          <div className="lg:col-span-2 space-y-8">
            <div className="pixel-card p-8">
              {(() => {
                const currentStatus = calculateStatus(selectedPet.hunger, selectedPet.aggressiveness)
                return (
                  <>
                    <div className="flex items-center justify-between mb-8">
                      <div>
                        <h3 className="text-3xl font-bold pixel-title-enhanced mb-2">► {selectedPet.name} ◄</h3>
                        <p className="text-lg pixel-title text-foreground">
                          {selectedPet.species} • LEVEL {selectedPet.level}
                        </p>
                      </div>
                      <div className="flex flex-col items-end space-y-2">
                        <Badge className={`bg-primary text-primary-foreground text-sm px-4 py-2 pixel-title`}>
                          LEVEL {selectedPet.level}
                        </Badge>
                        <Badge className={`${getStatusBadgeColor(currentStatus)} text-sm px-4 py-2 pixel-title`}>
                          {currentStatus}
                        </Badge>
                      </div>
                    </div>

                    <div className="grid md:grid-cols-2 gap-8">
                      <div className="text-center">
                        <div className="relative">
                          <div className="w-56 h-56 mx-auto rounded border-4 border-primary alien-glow bg-card/50 flex items-center justify-center relative overflow-hidden">
                            <img
                              src={getAlienImage(selectedPet.species, currentStatus) || "/placeholder.svg"}
                              alt={selectedPet.name}
                              className="w-48 h-48 pixel-render floating-element"
                            />
                            <div className="absolute inset-0 border-2 border-primary/30 rounded animate-pulse" />
                          </div>
                          <div className="absolute -top-2 -right-2 bg-accent text-accent-foreground px-3 py-1 rounded pixel-title text-sm">
                            LV.{selectedPet.level}
                          </div>
                        </div>
                        <p className={`mt-4 text-xl font-bold pixel-title ${getStatusColor(currentStatus)}`}>
                          ► {currentStatus} ◄
                        </p>
                        <div className="pixel-card p-4 mt-4 text-left">
                          <h5 className="pixel-title font-bold text-primary mb-2">► SPECIES DATA ◄</h5>
                          <p className="pixel-title text-foreground text-sm mb-3">
                            {SPECIES_INFO[selectedPet.species as keyof typeof SPECIES_INFO]?.description}
                          </p>
                          <div className="space-y-2">
                            <div>
                              <span className="pixel-title text-accent text-xs font-bold">ORIGIN: </span>
                              <span className="pixel-title text-foreground text-xs">
                                {SPECIES_INFO[selectedPet.species as keyof typeof SPECIES_INFO]?.origin}
                              </span>
                            </div>
                            <div>
                              <span className="pixel-title text-accent text-xs font-bold">TRAITS: </span>
                              <div className="flex flex-wrap gap-1 mt-1">
                                {SPECIES_INFO[selectedPet.species as keyof typeof SPECIES_INFO]?.traits.map(
                                  (trait, index) => (
                                    <Badge key={index} className="bg-primary/20 text-primary text-xs pixel-title">
                                      {trait}
                                    </Badge>
                                  ),
                                )}
                              </div>
                            </div>
                            <div>
                              <span className="pixel-title text-accent text-xs font-bold">CARE: </span>
                              <span className="pixel-title text-foreground text-xs">
                                {SPECIES_INFO[selectedPet.species as keyof typeof SPECIES_INFO]?.care}
                              </span>
                            </div>
                          </div>
                        </div>
                      </div>

                      <div className="space-y-6">
                        <div className="pixel-card p-4">
                          <div className="flex items-center justify-between mb-3">
                            <div className="flex items-center space-x-2">
                              <Apple className="h-5 w-5 text-destructive alien-glow" />
                              <span className="pixel-title font-bold text-destructive">HUNGER</span>
                            </div>
                            <span className="pixel-title text-destructive font-bold">{selectedPet.hunger}%</span>
                          </div>
                          <Progress
                            value={selectedPet.hunger}
                            className="h-3 bg-background border border-destructive"
                          />
                        </div>

                        <div className="pixel-card p-4">
                          <div className="flex items-center justify-between mb-3">
                            <div className="flex items-center space-x-2">
                              <Zap className="h-5 w-5 text-accent alien-glow" />
                              <span className="pixel-title font-bold text-accent">AGGRESSIVENESS</span>
                            </div>
                            <span className="pixel-title text-accent font-bold">{selectedPet.aggressiveness}%</span>
                          </div>
                          <Progress
                            value={selectedPet.aggressiveness}
                            className="h-3 bg-background border border-accent"
                          />
                        </div>

                        <div className="pixel-card p-4">
                          <div className="flex items-center justify-between mb-3">
                            <div className="flex items-center space-x-2">
                              <Star className="h-5 w-5 text-primary alien-glow" />
                              <span className="pixel-title font-bold text-primary">LEVEL</span>
                            </div>
                            <span className="pixel-title text-primary font-bold">{selectedPet.level}</span>
                          </div>
                          <div className="h-3 bg-background border border-primary rounded-full overflow-hidden">
                            <div
                              className="h-full bg-primary transition-all duration-300"
                              style={{ width: `${Math.min(100, (selectedPet.level % 10) * 10)}%` }}
                            />
                          </div>
                        </div>

                        <div className="grid grid-cols-2 gap-4">
                          <div className="pixel-card p-3 text-center">
                            <p className="pixel-title text-foreground text-xs">LAST FED</p>
                            <p className="pixel-title text-accent text-sm font-bold">
                              {formatLastActivity(selectedPet.lastFedAt)}
                            </p>
                          </div>
                          <div className="pixel-card p-3 text-center">
                            <p className="pixel-title text-foreground text-xs">LAST INTERACTION</p>
                            <p className="pixel-title text-accent text-sm font-bold">
                              {formatLastActivity(selectedPet.lastInteractedAt)}
                            </p>
                          </div>
                        </div>
                      </div>
                    </div>

                    <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mt-8">
                      <Button onClick={() => feedPet(selectedPet.id)} className="pixel-button">
                        <Apple className="h-4 w-4 mr-2" />
                        FEED
                      </Button>
                      <Button onClick={() => playWithPet(selectedPet.id)} className="pixel-button">
                        <Gamepad2 className="h-4 w-4 mr-2" />
                        PLAY
                      </Button>
                      <Button onClick={() => trainPet(selectedPet.id)} className="pixel-button">
                        <Target className="h-4 w-4 mr-2" />
                        TRAIN
                      </Button>
                      <Button
                        onClick={() => deletePet(selectedPet.id)}
                        className="pixel-button bg-destructive border-destructive"
                        disabled={calculateStatus(selectedPet.hunger, selectedPet.aggressiveness) !== "REBELLIOUS"}
                      >
                        <Skull className="h-4 w-4 mr-2" />
                        RELEASE
                      </Button>
                    </div>
                  </>
                )
              })()}
            </div>

            <div className="pixel-card p-6">
              <h4 className="text-xl font-bold pixel-title-enhanced text-center mb-6">► STATUS LOGIC ◄</h4>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4 text-center">
                <div className="pixel-card p-4">
                  <Badge className="bg-primary text-primary-foreground mb-2">CALM</Badge>
                  <p className="pixel-title text-foreground text-sm">Hunger &lt; 50% AND Aggressiveness &lt; 50%</p>
                </div>
                <div className="pixel-card p-4">
                  <Badge className="bg-destructive text-destructive-foreground mb-2">ANGRY</Badge>
                  <p className="pixel-title text-foreground text-sm">Hunger ≥ 50% OR Aggressiveness ≥ 50%</p>
                </div>
                <div className="pixel-card p-4">
                  <Badge className="bg-secondary text-secondary-foreground mb-2">REBELLIOUS</Badge>
                  <p className="pixel-title text-foreground text-sm">Hunger ≥ 80% OR Aggressiveness ≥ 80%</p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </main>

      <CreatePetModal isOpen={showCreateModal} onClose={() => setShowCreateModal(false)} />
    </div>
  )
}
