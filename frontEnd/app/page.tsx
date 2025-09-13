"use client"

import type React from "react"
import { useState, useEffect } from "react"
import { useRouter } from "next/navigation"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"

export default function AlienPetZoo() {
  const router = useRouter()
  const [isRegistering, setIsRegistering] = useState(false)
  const [formData, setFormData] = useState({
    username: "",
    email: "",
    password: "",
    confirmPassword: "",
  })

  useEffect(() => {
    const createMechanicalClickSound = () => {
      const audioContext = new (window.AudioContext || (window as any).webkitAudioContext)()

      // Create two quick clicks for realistic mechanical keyboard sound
      const createSingleClick = (delay: number) => {
        const oscillator = audioContext.createOscillator()
        const gainNode = audioContext.createGain()
        const filter = audioContext.createBiquadFilter()

        oscillator.connect(filter)
        filter.connect(gainNode)
        gainNode.connect(audioContext.destination)

        // Sharp click frequencies
        oscillator.frequency.setValueAtTime(800 + Math.random() * 200, audioContext.currentTime + delay)
        oscillator.type = "square"

        // High-pass filter for crisp click
        filter.type = "highpass"
        filter.frequency.setValueAtTime(400, audioContext.currentTime + delay)

        // Very short, sharp envelope
        gainNode.gain.setValueAtTime(0, audioContext.currentTime + delay)
        gainNode.gain.setValueAtTime(0.15, audioContext.currentTime + delay + 0.001)
        gainNode.gain.exponentialRampToValueAtTime(0.01, audioContext.currentTime + delay + 0.02)

        oscillator.start(audioContext.currentTime + delay)
        oscillator.stop(audioContext.currentTime + delay + 0.02)
      }

      // Create double click for realistic mechanical sound
      createSingleClick(0)
      createSingleClick(0.01)
    }

    const createDoomDoorSound = () => {
      const audioContext = new (window.AudioContext || (window as any).webkitAudioContext)()

      const oscillator = audioContext.createOscillator()
      const gainNode = audioContext.createGain()
      const filter = audioContext.createBiquadFilter()

      oscillator.connect(filter)
      filter.connect(gainNode)
      gainNode.connect(audioContext.destination)

      // Doom-like door sound
      oscillator.frequency.setValueAtTime(150, audioContext.currentTime)
      oscillator.frequency.linearRampToValueAtTime(80, audioContext.currentTime + 0.3)
      oscillator.frequency.linearRampToValueAtTime(120, audioContext.currentTime + 0.6)

      filter.type = "lowpass"
      filter.frequency.setValueAtTime(800, audioContext.currentTime)
      filter.frequency.linearRampToValueAtTime(200, audioContext.currentTime + 0.6)

      oscillator.type = "sawtooth"

      gainNode.gain.setValueAtTime(0.3, audioContext.currentTime)
      gainNode.gain.exponentialRampToValueAtTime(0.01, audioContext.currentTime + 0.6)

      oscillator.start(audioContext.currentTime)
      oscillator.stop(audioContext.currentTime + 0.6)
    }

    const handleKeyPress = (e: KeyboardEvent) => {
      if (e.key.length === 1 || e.key === "Backspace" || e.key === "Enter") {
        try {
          createMechanicalClickSound()
        } catch (error) {
          console.log("[v0] Audio context error:", error)
        }
      }
    }

    const handleButtonClick = (e: Event) => {
      const target = e.target as HTMLElement
      if (target.tagName === "BUTTON" || target.closest("button")) {
        try {
          createDoomDoorSound()
        } catch (error) {
          console.log("[v0] Audio context error:", error)
        }
      }
    }

    document.addEventListener("keydown", handleKeyPress)
    document.addEventListener("click", handleButtonClick)

    return () => {
      document.removeEventListener("keydown", handleKeyPress)
      document.removeEventListener("click", handleButtonClick)
    }
  }, [])

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setFormData((prev) => ({
      ...prev,
      [e.target.name]: e.target.value,
    }))
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    console.log("Form submitted:", formData)

    // Simple validation for demo purposes
    if (isRegistering) {
      if (formData.password !== formData.confirmPassword) {
        alert("Las contraseñas no coinciden")
        return
      }
      if (formData.username && formData.email && formData.password) {
        // Store user data in localStorage for demo
        localStorage.setItem(
          "alienZooUser",
          JSON.stringify({
            username: formData.username,
            email: formData.email,
          }),
        )
        router.push("/dashboard")
      }
    } else {
      // Check for admin credentials
      if (formData.email === "admin@xenobio.space" && formData.password === "admin123") {
        localStorage.setItem(
          "alienZooUser",
          JSON.stringify({
            username: "ADMIN",
            email: formData.email,
            role: "admin",
          }),
        )
        router.push("/admin")
        return
      }

      // Login - for demo, any other email/password combination works for regular users
      if (formData.email && formData.password) {
        localStorage.setItem(
          "alienZooUser",
          JSON.stringify({
            username: formData.email.split("@")[0],
            email: formData.email,
          }),
        )
        router.push("/dashboard")
      }
    }
  }

  return (
    <div className="min-h-screen relative overflow-hidden">
      <div className="pixel-space-background">
        <div className="pixel-stars pixel-stars-1"></div>
        <div className="pixel-stars pixel-stars-2"></div>
        <div className="pixel-stars pixel-stars-3"></div>
      </div>

      <img
        src="https://hebbkx1anhila5yf.public.blob.vercel-storage.com/%E2%80%94Pngtree%E2%80%94%20rock%20astronaut%20illustration%20pop_5329815-SKCoZiXp8umLVj0CgIpDG5UBT3zHaX.png"
        alt="Rock astronaut floating in space"
        className="floating-astronaut-fullscreen"
      />

      <img
        src="https://hebbkx1anhila5yf.public.blob.vercel-storage.com/neur_CALM-hamjYSIlw6ALIgeEXdCHga2XKFCS7m.png"
        alt="Neural alien floating"
        className="floating-alien-1"
      />
      <img
        src="https://hebbkx1anhila5yf.public.blob.vercel-storage.com/xeno_CALM-oc9lc2l8oQ5RDwVfhlDZKcUoOqnXzp.png"
        alt="Xenomorph floating"
        className="floating-alien-2"
      />
      <img
        src="https://hebbkx1anhila5yf.public.blob.vercel-storage.com/pred_CALM-gAZ8Lc89gLeC87gyfLpUzkvERVKN3O.png"
        alt="Predator floating"
        className="floating-alien-3"
      />
      <img
        src="https://hebbkx1anhila5yf.public.blob.vercel-storage.com/face_CALM-YGtYujwimsxGEY0PyOeiMKklXmPTCP.png"
        alt="Facehugger floating"
        className="floating-alien-4"
      />
      <img
        src="https://hebbkx1anhila5yf.public.blob.vercel-storage.com/split_CALM-1tTcbraucE5XXhqNFJT5t3gBPbZUt2.png"
        alt="Split alien floating"
        className="floating-alien-5"
      />

      <div className="absolute top-8 left-1/2 transform -translate-x-1/2 z-20">
        <h1 className="pixel-title-enhanced text-center">ALIEN PET ZOO</h1>
        <p className="text-center text-primary text-lg mt-2 font-mono pixel-subtitle">
          ◆ INTERGALACTIC SPECIMEN COLLECTION ◆
        </p>
      </div>

      <div className="flex items-center justify-center min-h-screen relative z-10">
        <div className="fixed bottom-8 left-8 z-30 max-w-sm">
          <div className="relative">
            {/* Comic book speech bubble */}
            <div className="pixel-card p-4 bg-black/90 border-2 border-primary relative mb-4">
              <div className="text-center">
                <div className="text-primary text-xs font-bold mb-2">◆ COMMANDER SUBIRACHS ◆</div>
                <div className="text-xs text-green-400 leading-tight font-mono">
                  {isRegistering
                    ? "Fill all fields to register as new specimen handler. Use strong access codes."
                    : "Enter your credentials to access the laboratory. Admin access: admin@xenobio.space"}
                </div>
              </div>
              {/* Speech bubble tail */}
              <div className="absolute bottom-[-8px] left-8 w-0 h-0 border-l-[8px] border-l-transparent border-r-[8px] border-r-transparent border-t-[8px] border-t-primary"></div>
              <div className="absolute bottom-[-6px] left-[9px] w-0 h-0 border-l-[6px] border-l-transparent border-r-[6px] border-r-transparent border-t-[6px] border-black"></div>
            </div>
            {/* Commander image - larger and more visible */}
            <img
              src="/commander.png"
              alt="Commander Subirachs"
              className="w-24 h-24 pixelated mx-auto border-2 border-primary/50 bg-black/50 rounded-lg"
            />
          </div>
        </div>

        <div className="pixel-card p-8 max-w-md w-full mx-4">
          <div className="text-center mb-6">
            <div className="text-primary text-sm font-bold mb-2">◆ SYSTEM ACCESS ◆</div>
            <div className="text-xs text-muted-foreground">
              {isRegistering ? "NEW SPECIMEN HANDLER REGISTRATION" : "AUTHORIZED PERSONNEL ONLY"}
            </div>
          </div>

          <form onSubmit={handleSubmit} className="space-y-4">
            {isRegistering && (
              <div>
                <Label htmlFor="username" className="text-primary text-sm font-bold">
                  ▶ HANDLER ID
                </Label>
                <Input
                  id="username"
                  name="username"
                  type="text"
                  placeholder="ENTER_CALLSIGN"
                  value={formData.username}
                  onChange={handleInputChange}
                  className="pixel-input mt-1"
                  required
                />
              </div>
            )}

            <div>
              <Label htmlFor="email" className="text-primary text-sm font-bold">
                ▶ COMM FREQUENCY
              </Label>
              <Input
                id="email"
                name="email"
                type="email"
                placeholder="handler@xenobio.space"
                value={formData.email}
                onChange={handleInputChange}
                className="pixel-input mt-1"
                required
              />
            </div>

            <div>
              <Label htmlFor="password" className="text-primary text-sm font-bold">
                ▶ ACCESS CODE
              </Label>
              <Input
                id="password"
                name="password"
                type="password"
                placeholder="••••••••"
                value={formData.password}
                onChange={handleInputChange}
                className="pixel-input mt-1"
                required
              />
            </div>

            {isRegistering && (
              <div>
                <Label htmlFor="confirmPassword" className="text-primary text-sm font-bold">
                  ▶ CONFIRM CODE
                </Label>
                <Input
                  id="confirmPassword"
                  name="confirmPassword"
                  type="password"
                  placeholder="••••••••"
                  value={formData.confirmPassword}
                  onChange={handleInputChange}
                  className="pixel-input mt-1"
                  required
                />
              </div>
            )}

            <button type="submit" className="pixel-button w-full mt-6">
              {isRegistering ? "◆ REGISTER HANDLER ◆" : "◆ ACCESS GRANTED ◆"}
            </button>
          </form>

          <div className="mt-6 text-center border-t border-primary/30 pt-4">
            <button
              type="button"
              onClick={() => setIsRegistering(!isRegistering)}
              className="text-secondary hover:text-accent transition-colors text-sm"
            >
              {isRegistering ? "← RETURN TO ACCESS" : "NEW HANDLER REGISTRATION →"}
            </button>
          </div>

          <div className="mt-4 text-center">
            <div className="text-xs text-muted-foreground">XENOBIO SYSTEMS v3.7.2</div>
          </div>
        </div>
      </div>
    </div>
  )
}
