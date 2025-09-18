"use client"
import { useState, useEffect } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"

interface UserResponseDTO {
  id: number
  username: string
  email: string
  role: string
}

interface PetResponseDTO {
  id: number
  name: string
  species: string
  level: number
  hunger: number
  aggressiveness: number
  status: string
}

interface AdminStats {
  totalUsers: number
  activeUsers: number
  totalPets: number
  dailyLogins: number
  newRegistrations: number
}

export default function AdminPanel() {
  const [selectedTab, setSelectedTab] = useState("overview")
  const [selectedUser, setSelectedUser] = useState<number | null>(null)
  const [users, setUsers] = useState<UserResponseDTO[]>([])
  const [userPets, setUserPets] = useState<{ [userId: number]: PetResponseDTO[] }>({})
  const [stats, setStats] = useState<AdminStats>({
    totalUsers: 0,
    activeUsers: 0,
    totalPets: 0,
    dailyLogins: 0,
    newRegistrations: 0,
  })
  const [loading, setLoading] = useState(true)

  const fetchUsers = async () => {
    try {
      const token = localStorage.getItem("token")
      const response = await fetch("http://localhost:8080/api/admin/users", {
        headers: {
          Authorization: `Bearer ${token}`,
          "Content-Type": "application/json",
        },
      })
      if (response.ok) {
        const data = await response.json()
        setUsers(data)
      }
    } catch (error) {
      console.error("Error fetching users:", error)
    }
  }

  const fetchUserPets = async (userId: number) => {
    try {
      const token = localStorage.getItem("token")
      const response = await fetch(`http://localhost:8080/api/admin/users/${userId}/pets`, {
        headers: {
          Authorization: `Bearer ${token}`,
          "Content-Type": "application/json",
        },
      })
      if (response.ok) {
        const data = await response.json()
        setUserPets((prev) => ({ ...prev, [userId]: data }))
      }
    } catch (error) {
      console.error("Error fetching user pets:", error)
    }
  }

  const fetchStats = async () => {
    try {
      const token = localStorage.getItem("token")
      const response = await fetch("http://localhost:8080/api/admin/stats", {
        headers: {
          Authorization: `Bearer ${token}`,
          "Content-Type": "application/json",
        },
      })
      if (response.ok) {
        const data = await response.json()
        setStats(data)
      }
    } catch (error) {
      console.error("Error fetching stats:", error)
    }
  }

  const deleteUser = async (userId: number) => {
    try {
      const token = localStorage.getItem("token")
      const response = await fetch(`http://localhost:8080/api/admin/users/${userId}`, {
        method: "DELETE",
        headers: {
          Authorization: `Bearer ${token}`,
          "Content-Type": "application/json",
        },
      })
      if (response.ok) {
        await fetchUsers()
        await fetchStats()
        if (selectedUser === userId) {
          setSelectedUser(null)
          setSelectedTab("users")
        }
      }
    } catch (error) {
      console.error("Error deleting user:", error)
    }
  }

  const deletePet = async (petId: number, userId: number) => {
    try {
      const token = localStorage.getItem("token")
      const response = await fetch(`http://localhost:8080/api/admin/pets/${petId}`, {
        method: "DELETE",
        headers: {
          Authorization: `Bearer ${token}`,
          "Content-Type": "application/json",
        },
      })
      if (response.ok) {
        await fetchUserPets(userId)
        await fetchStats()
      }
    } catch (error) {
      console.error("Error deleting pet:", error)
    }
  }

  useEffect(() => {
    const loadData = async () => {
      setLoading(true)
      await Promise.all([fetchUsers(), fetchStats()])
      setLoading(false)
    }
    loadData()
  }, [])

  useEffect(() => {
    if (selectedUser && !userPets[selectedUser]) {
      fetchUserPets(selectedUser)
    }
  }, [selectedUser])

  const handleUserAction = (userId: number, action: string) => {
    if (action === "view") {
      setSelectedUser(userId)
      setSelectedTab("user-detail")
    } else if (action === "delete") {
      if (confirm("Are you sure you want to delete this user?")) {
        deleteUser(userId)
      }
    }
  }

  const handlePetDelete = (userId: number, petId: number) => {
    if (confirm("Are you sure you want to delete this pet?")) {
      deletePet(petId, userId)
    }
  }

  const handleLogout = () => {
    localStorage.removeItem("token")
    localStorage.removeItem("user")
    window.location.href = "/"
  }

  const selectedUserData = users.find((user) => user.id === selectedUser)
  const selectedUserPets = selectedUser ? userPets[selectedUser] || [] : []

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-primary pixel-title-enhanced">◄ LOADING COMMAND CENTER ►</div>
      </div>
    )
  }

  return (
    <div className="min-h-screen relative">
      <div
        className="absolute inset-0 bg-cover bg-center bg-no-repeat"
        style={{
          backgroundImage: `url('/intergalactic-command-center-spaceship-bridge-with.jpg')`,
          imageRendering: "pixelated",
        }}
      />
      <div className="absolute inset-0 bg-black/20 backdrop-blur-none" />

      <div className="fixed bottom-8 left-8 z-30 max-w-sm">
        <div className="relative">
          <div className="pixel-card p-4 bg-black/90 border-2 border-primary relative mb-4">
            <div className="text-center">
              <div className="text-primary text-xs font-bold mb-2">◆ COMMANDER SUBIRACHS ◆</div>
              <div className="text-xs text-green-400 leading-tight font-mono">
                {selectedTab === "overview"
                  ? "Monitor system statistics and user activity. Keep the space zoo under control at all times."
                  : selectedTab === "users"
                    ? "Manage all handlers and their specimens. Delete problematic users or dangerous pets when necessary."
                    : "Review individual handler details. You have full authority to remove users or their alien specimens."}
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

      <header className="relative z-10 border-b-2 border-primary bg-card/90 backdrop-blur-sm">
        <div className="container mx-auto px-4 py-4 flex items-center justify-between">
          <div className="flex items-center space-x-4">
            <div className="h-10 w-10 text-primary alien-glow pixel-art flex items-center justify-center text-2xl font-bold">
              🛡️
            </div>
            <div>
              <h1 className="text-2xl font-bold pixel-title-enhanced">◄ INTERGALACTIC COMMAND CENTER ►</h1>
              <p className="text-sm pixel-subtitle text-foreground">TOTAL CONTROL OF THE SPACE ZOO</p>
            </div>
          </div>

          <div className="flex items-center space-x-4">
            <Badge className="bg-primary text-primary-foreground pixel-title">ADMIN</Badge>
            <Button className="pixel-button bg-destructive border-destructive" onClick={handleLogout}>
              <span className="mr-2">⏻</span>
              EXIT COMMAND
            </Button>
          </div>
        </div>
      </header>

      <main className="relative z-10 container mx-auto px-4 py-6">
        <Tabs value={selectedTab} onValueChange={setSelectedTab} className="space-y-6">
          <TabsList className="grid w-full grid-cols-2 pixel-card">
            <TabsTrigger
              value="overview"
              className="pixel-title data-[state=active]:bg-primary/30 data-[state=active]:text-primary"
            >
              <span className="mr-2">📊</span>► OVERVIEW ◄
            </TabsTrigger>
            <TabsTrigger
              value="users"
              className="pixel-title data-[state=active]:bg-primary/30 data-[state=active]:text-primary"
            >
              <span className="mr-2">👥</span>► USERS MANAGEMENT ◄
            </TabsTrigger>
          </TabsList>

          {/* Overview Tab */}
          <TabsContent value="overview" className="space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              <Card className="pixel-card">
                <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                  <CardTitle className="text-sm font-medium pixel-title text-foreground">TOTAL USERS</CardTitle>
                  <span className="text-primary alien-glow text-lg">👥</span>
                </CardHeader>
                <CardContent>
                  <div className="text-2xl font-bold pixel-title-enhanced text-primary">
                    {stats.totalUsers.toLocaleString()}
                  </div>
                  <p className="text-xs pixel-title text-accent">+{stats.newRegistrations} new today</p>
                </CardContent>
              </Card>

              <Card className="pixel-card">
                <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                  <CardTitle className="text-sm font-medium pixel-title text-foreground">ACTIVE USERS</CardTitle>
                  <span className="text-accent alien-glow text-lg">⚡</span>
                </CardHeader>
                <CardContent>
                  <div className="text-2xl font-bold pixel-title-enhanced text-accent">
                    {stats.activeUsers.toLocaleString()}
                  </div>
                  <p className="text-xs pixel-title text-foreground">{stats.dailyLogins} logins today</p>
                </CardContent>
              </Card>

              <Card className="pixel-card">
                <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                  <CardTitle className="text-sm font-medium pixel-title text-foreground">TOTAL PETS</CardTitle>
                  <span className="text-secondary alien-glow text-lg">👾</span>
                </CardHeader>
                <CardContent>
                  <div className="text-2xl font-bold pixel-title-enhanced text-secondary">
                    {stats.totalPets.toLocaleString()}
                  </div>
                  <p className="text-xs pixel-title text-foreground">5 species available</p>
                </CardContent>
              </Card>
            </div>

            <Card className="pixel-card">
              <CardHeader>
                <CardTitle className="text-lg pixel-title-enhanced text-primary">► RECENT ACTIVITY ◄</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-3">
                  <div className="flex items-center space-x-3 p-3 pixel-card">
                    <div className="w-2 h-2 bg-accent rounded-full alien-glow"></div>
                    <span className="text-sm pixel-title text-foreground">New user registered: SpaceExplorer_42</span>
                    <span className="text-xs pixel-title text-accent ml-auto">5 min ago</span>
                  </div>
                  <div className="flex items-center space-x-3 p-3 pixel-card">
                    <div className="w-2 h-2 bg-primary rounded-full alien-glow"></div>
                    <span className="text-sm pixel-title text-foreground">Pet captured: Xenomorph specimen</span>
                    <span className="text-xs pixel-title text-accent ml-auto">15 min ago</span>
                  </div>
                  <div className="flex items-center space-x-3 p-3 pixel-card">
                    <div className="w-2 h-2 bg-destructive rounded-full alien-glow"></div>
                    <span className="text-sm pixel-title text-foreground">User suspended for terms violation</span>
                    <span className="text-xs pixel-title text-accent ml-auto">1 hour ago</span>
                  </div>
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          {/* Users Tab */}
          <TabsContent value="users" className="space-y-6">
            <Card className="pixel-card">
              <CardHeader>
                <CardTitle className="text-lg pixel-title-enhanced text-primary">► USER MANAGEMENT ◄</CardTitle>
                <CardDescription className="pixel-title text-foreground">
                  Manage all system users and their alien pets
                </CardDescription>
              </CardHeader>
              <CardContent>
                <Table>
                  <TableHeader>
                    <TableRow className="border-primary/20">
                      <TableHead className="pixel-title text-primary">USER</TableHead>
                      <TableHead className="pixel-title text-primary">EMAIL</TableHead>
                      <TableHead className="pixel-title text-primary">ROLE</TableHead>
                      <TableHead className="pixel-title text-primary">ACTIONS</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {users.map((user) => (
                      <TableRow key={user.id} className="border-primary/10 hover:bg-primary/5">
                        <TableCell className="font-medium pixel-title text-foreground">{user.username}</TableCell>
                        <TableCell className="pixel-title text-foreground">{user.email}</TableCell>
                        <TableCell>
                          <Badge className="pixel-title bg-accent text-accent-foreground">{user.role}</Badge>
                        </TableCell>
                        <TableCell>
                          <div className="flex space-x-2">
                            <Button
                              size="sm"
                              className="pixel-button"
                              onClick={() => handleUserAction(user.id, "view")}
                            >
                              👁️
                            </Button>
                            <Button
                              size="sm"
                              className="pixel-button bg-destructive border-destructive"
                              onClick={() => handleUserAction(user.id, "delete")}
                            >
                              🗑️
                            </Button>
                          </div>
                        </TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              </CardContent>
            </Card>
          </TabsContent>

          {/* User Detail Tab */}
          <TabsContent value="user-detail" className="space-y-6">
            {selectedUserData && (
              <>
                <div className="flex items-center space-x-4 mb-6">
                  <Button className="pixel-button" onClick={() => setSelectedTab("users")}>
                    ◄ BACK TO USERS
                  </Button>
                  <h2 className="text-2xl font-bold pixel-title-enhanced text-primary">
                    ► {selectedUserData.username} ◄
                  </h2>
                </div>

                <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                  {/* User Info */}
                  <Card className="pixel-card">
                    <CardHeader>
                      <CardTitle className="text-lg pixel-title-enhanced text-primary">► USER INFO ◄</CardTitle>
                    </CardHeader>
                    <CardContent className="space-y-3">
                      <div>
                        <span className="text-sm pixel-title text-accent">USERNAME:</span>
                        <p className="pixel-title text-foreground">{selectedUserData.email}</p>
                      </div>
                      <div>
                        <span className="text-sm pixel-title text-accent">ROLE:</span>
                        <Badge className="pixel-title bg-accent text-accent-foreground">{selectedUserData.role}</Badge>
                      </div>
                      <Button
                        className="pixel-button bg-destructive border-destructive w-full mt-4"
                        onClick={() => handleUserAction(selectedUserData.id, "delete")}
                      >
                        <span className="mr-2">🗑️</span>► DELETE USER ◄
                      </Button>
                    </CardContent>
                  </Card>

                  {/* User's Pets */}
                  <Card className="lg:col-span-2 pixel-card">
                    <CardHeader>
                      <CardTitle className="text-lg pixel-title-enhanced text-accent">► USER'S ALIEN PETS ◄</CardTitle>
                      <CardDescription className="pixel-title text-foreground">
                        {selectedUserPets.length} pets in collection
                      </CardDescription>
                    </CardHeader>
                    <CardContent>
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        {selectedUserPets.map((pet) => (
                          <div key={pet.id} className="pixel-card p-4">
                            <div className="flex items-center justify-between mb-2">
                              <h3 className="font-semibold pixel-title text-foreground">► {pet.name} ◄</h3>
                              <Badge
                                className={
                                  pet.status === "CALM"
                                    ? "pixel-title bg-primary text-primary-foreground"
                                    : pet.status === "ANGRY"
                                      ? "pixel-title bg-destructive text-destructive-foreground"
                                      : "pixel-title bg-secondary text-secondary-foreground"
                                }
                              >
                                {pet.status}
                              </Badge>
                            </div>
                            <p className="text-sm pixel-title text-foreground mb-1">SPECIES: {pet.species}</p>
                            <p className="text-sm pixel-title text-foreground mb-1">LEVEL: {pet.level}</p>
                            <p className="text-sm pixel-title text-foreground mb-3">
                              HUNGER: {pet.hunger}% | AGGR: {pet.aggressiveness}%
                            </p>
                            <Button
                              size="sm"
                              className="pixel-button bg-destructive border-destructive"
                              onClick={() => handlePetDelete(selectedUserData.id, pet.id)}
                            >
                              <span className="mr-1">🗑️</span>
                              DELETE PET
                            </Button>
                          </div>
                        ))}
                      </div>
                    </CardContent>
                  </Card>
                </div>
              </>
            )}
          </TabsContent>
        </Tabs>
      </main>
    </div>
  )
}
