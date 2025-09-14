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

  const token = localStorage.getItem("token")

  const fetchUser = async () => {
    const res = await fetch("http://localhost:8080/auth/me", {
      headers: { Authorization: `Bearer ${token}` },
    })
    if (res.ok) {
      const data = await res.json()
      setUser(data)
    }
  }

  const fetchPets = async () => {
    const res = await fetch("http://localhost:8080/api/pets", {
      headers: { Authorization: `Bearer ${token}` },
    })
    if (res.ok) {
      const data = await res.json()
      setPets(data)
      if (data.length > 0 && !selectedPet) {
        setSelectedPet(data[0])
      } else if (selectedPet) {
        const updatedSelectedPet = data.find((pet: PetResponseDTO) => pet.id === selectedPet.id)
        if (updatedSelectedPet) {
          setSelectedPet(updatedSelectedPet)
        } else if (data.length > 0) {
          setSelectedPet(data[0])
        }
      }
    }
  }

  useEffect(() => {
    fetchUser().then(fetchPets)
  }, [])

  const handleAction = async (petId: number, action: string) => {
    let url = `http://localhost:8080/api/pets/${petId}/${action}`
    let method = "POST"
    if (action === "release") {
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
    if (!user) return

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

      {/* Commander Subirachs */}
      <div className="fixed bottom-8 left-8 z-20 max-w-xs">
        <div className="relative">
          <div className="bg-green-900/90 border-2 border-green-400 rounded-lg p-3 mb-2 relative">
            <div className="text-green-400 text-xs font-bold mb-1 font-mono">COMMANDER SUBIRACHS</div>
            <div className="text-green-300 text-xs leading-tight font-mono">
              Monitor your specimens carefully. Only CALM aliens can be captured. Feed and play with them to prevent
              rebellion. REBELLIOUS specimens must be released immediately.
            </div>
            <div className="absolute bottom-[-8px] left-6 w-0 h-0 border-l-[8px] border-l-transparent border-r-[8px] border-r-transparent border-t-[8px] border-t-green-400"></div>
          </div>
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
              <p className="text-sm pixel-subtitle text-foreground">
                ALIEN RESEARCH FACILITY - {user?.username || "LOADING..."}
              </p>
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
        {pets.length === 0 ? (
          <div className="pixel-card p-8 text-center">
            <h2 className="pixel-title-enhanced text-2xl mb-4">► NO SPECIMENS DETECTED ◄</h2>
            <p className="pixel-title text-lg text-primary mb-6">
              Welcome Commander {user?.username}, no specimens in your lab yet.
            </p>
            <Button className="pixel-button" onClick={() => setShowCreateModal(true)}>
              <Plus className="h-4 w-4 mr-2" />
              CAPTURE NEW SPECIMEN
            </Button>
          </div>
        ) : (
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
                {pets.map((pet) => (
                  <div
                    key={pet.id}
                    className={`pixel-card cursor-pointer transition-all p-4 ${
                      selectedPet?.id === pet.id ? "border-accent bg-accent/20" : ""
                    }`}
                    onClick={() => setSelectedPet(pet)}
                  >
                    <div className="flex items-center space-x-4">
                      <img
                        src={getAlienImage(pet.species, pet.status) || "/placeholder.svg"}
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
                          <Badge className={`text-xs pixel-title ${getStatusBadgeColor(pet.status)}`}>
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
              <div className="lg:col-span-2 space-y-8">
                <div className="pixel-card p-8">
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
                      <Badge className={`${getStatusBadgeColor(selectedPet.status)} text-sm px-4 py-2 pixel-title`}>
                        {selectedPet.status}
                      </Badge>
                    </div>
                  </div>

                  <div className="grid md:grid-cols-2 gap-8">
                    <div className="text-center">
                      <div className="relative">
                        <div className="w-56 h-56 mx-auto rounded border-4 border-primary alien-glow bg-card/50 flex items-center justify-center relative overflow-hidden">
                          <img
                            src={getAlienImage(selectedPet.species, selectedPet.status) || "/placeholder.svg"}
                            alt={selectedPet.name}
                            className="w-48 h-48 pixel-render floating-element"
                          />
                          <div className="absolute inset-0 border-2 border-primary/30 rounded animate-pulse" />
                        </div>
                        <div className="absolute -top-2 -right-2 bg-accent text-accent-foreground px-3 py-1 rounded pixel-title text-sm">
                          LV.{selectedPet.level}
                        </div>
                      </div>
                      <p className={`mt-4 text-xl font-bold pixel-title ${getStatusColor(selectedPet.status)}`}>
                        ► {selectedPet.status} ◄
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
                        <Progress value={selectedPet.hunger} className="h-3 bg-background border border-destructive" />
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
                    </div>
                  </div>

                  <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mt-8">
                    <Button onClick={() => handleAction(selectedPet.id, "feed")} className="pixel-button">
                      <Apple className="h-4 w-4 mr-2" />
                      FEED
                    </Button>
                    <Button onClick={() => handleAction(selectedPet.id, "play")} className="pixel-button">
                      <Gamepad2 className="h-4 w-4 mr-2" />
                      PLAY
                    </Button>
                    <Button onClick={() => handleAction(selectedPet.id, "train")} className="pixel-button">
                      <Target className="h-4 w-4 mr-2" />
                      TRAIN
                    </Button>
                    <Button
                      onClick={() => handleAction(selectedPet.id, "release")}
                      className="pixel-button bg-destructive border-destructive"
                    >
                      <Skull className="h-4 w-4 mr-2" />
                      RELEASE
                    </Button>
                  </div>
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
