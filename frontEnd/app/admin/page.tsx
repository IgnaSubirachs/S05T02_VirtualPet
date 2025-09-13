"use client"
import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { Shield, Users, Eye, Trash2, BarChart3, Bug, Activity, LogOut } from "lucide-react"

// Mock data for admin - here you would connect with your API
const mockUsers = [
  {
    id: 1,
    username: "SpaceKeeper_2087",
    email: "user1@example.com",
    level: 12,
    pets: [
      { id: 1, name: "Zyx", species: "XENOMORPH", mood: "CALM" },
      { id: 2, name: "Vortex", species: "PREDATOR", mood: "ANGRY" },
      { id: 3, name: "Echo", species: "FACEHUGGER", mood: "REBELLIOUS" },
    ],
    status: "Active",
    joinDate: "2024-01-15",
  },
  {
    id: 2,
    username: "AlienLover99",
    email: "user2@example.com",
    level: 8,
    pets: [
      { id: 4, name: "Nebula", species: "ACIDSPITTER", mood: "CALM" },
      { id: 5, name: "Quantum", species: "NEUROMANCER", mood: "CALM" },
      { id: 6, name: "Plasma", species: "XENOMORPH", mood: "ANGRY" },
      { id: 7, name: "Void", species: "PREDATOR", mood: "REBELLIOUS" },
      { id: 8, name: "Crystal", species: "FACEHUGGER", mood: "CALM" },
    ],
    status: "Active",
    joinDate: "2024-02-20",
  },
  {
    id: 3,
    username: "CosmicTrainer",
    email: "user3@example.com",
    level: 25,
    pets: [
      { id: 9, name: "Shadow", species: "NEUROMANCER", mood: "ANGRY" },
      { id: 10, name: "Blaze", species: "ACIDSPITTER", mood: "CALM" },
    ],
    status: "Banned",
    joinDate: "2023-12-10",
  },
]

const mockStats = {
  totalUsers: 1247,
  activeUsers: 892,
  totalPets: 3456,
  totalSpecies: 5, // Fixed number of species
  dailyLogins: 234,
  newRegistrations: 12,
}

export default function AdminPanel() {
  const [selectedTab, setSelectedTab] = useState("overview")
  const [selectedUser, setSelectedUser] = useState<number | null>(null)

  const handleUserAction = (userId: number, action: string) => {
    if (action === "view") {
      setSelectedUser(userId)
      setSelectedTab("user-detail")
    } else if (action === "delete") {
      console.log(`Deleting user ${userId}`)
      // Here you would connect with your API
    }
  }

  const handlePetDelete = (userId: number, petId: number) => {
    console.log(`Deleting pet ${petId} from user ${userId}`)
    // Here you would connect with your API
  }

  const handleLogout = () => {
    window.location.href = "/"
  }

  const selectedUserData = mockUsers.find((user) => user.id === selectedUser)

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
            <Shield className="h-10 w-10 text-primary alien-glow pixel-art" />
            <div>
              <h1 className="text-2xl font-bold pixel-title-enhanced">◄ INTERGALACTIC COMMAND CENTER ►</h1>
              <p className="text-sm pixel-subtitle text-foreground">TOTAL CONTROL OF THE SPACE ZOO</p>
            </div>
          </div>

          <div className="flex items-center space-x-4">
            <Badge className="bg-primary text-primary-foreground pixel-title">ADMIN</Badge>
            <Button className="pixel-button bg-destructive border-destructive" onClick={handleLogout}>
              <LogOut className="h-4 w-4 mr-2" />
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
              <BarChart3 className="h-4 w-4 mr-2" />► OVERVIEW ◄
            </TabsTrigger>
            <TabsTrigger
              value="users"
              className="pixel-title data-[state=active]:bg-primary/30 data-[state=active]:text-primary"
            >
              <Users className="h-4 w-4 mr-2" />► USERS MANAGEMENT ◄
            </TabsTrigger>
          </TabsList>

          {/* Overview Tab */}
          <TabsContent value="overview" className="space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              <Card className="pixel-card">
                <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                  <CardTitle className="text-sm font-medium pixel-title text-foreground">TOTAL USERS</CardTitle>
                  <Users className="h-4 w-4 text-primary alien-glow" />
                </CardHeader>
                <CardContent>
                  <div className="text-2xl font-bold pixel-title-enhanced text-primary">
                    {mockStats.totalUsers.toLocaleString()}
                  </div>
                  <p className="text-xs pixel-title text-accent">+{mockStats.newRegistrations} new today</p>
                </CardContent>
              </Card>

              <Card className="pixel-card">
                <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                  <CardTitle className="text-sm font-medium pixel-title text-foreground">ACTIVE USERS</CardTitle>
                  <Activity className="h-4 w-4 text-accent alien-glow" />
                </CardHeader>
                <CardContent>
                  <div className="text-2xl font-bold pixel-title-enhanced text-accent">
                    {mockStats.activeUsers.toLocaleString()}
                  </div>
                  <p className="text-xs pixel-title text-foreground">{mockStats.dailyLogins} logins today</p>
                </CardContent>
              </Card>

              <Card className="pixel-card">
                <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                  <CardTitle className="text-sm font-medium pixel-title text-foreground">TOTAL PETS</CardTitle>
                  <Bug className="h-4 w-4 text-secondary alien-glow" />
                </CardHeader>
                <CardContent>
                  <div className="text-2xl font-bold pixel-title-enhanced text-secondary">
                    {mockStats.totalPets.toLocaleString()}
                  </div>
                  <p className="text-xs pixel-title text-foreground">{mockStats.totalSpecies} species available</p>
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
                      <TableHead className="pixel-title text-primary">LEVEL</TableHead>
                      <TableHead className="pixel-title text-primary">PETS</TableHead>
                      <TableHead className="pixel-title text-primary">STATUS</TableHead>
                      <TableHead className="pixel-title text-primary">JOINED</TableHead>
                      <TableHead className="pixel-title text-primary">ACTIONS</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {mockUsers.map((user) => (
                      <TableRow key={user.id} className="border-primary/10 hover:bg-primary/5">
                        <TableCell className="font-medium pixel-title text-foreground">{user.username}</TableCell>
                        <TableCell className="pixel-title text-foreground">{user.email}</TableCell>
                        <TableCell>
                          <Badge className="pixel-title bg-accent text-accent-foreground">LV. {user.level}</Badge>
                        </TableCell>
                        <TableCell className="pixel-title text-foreground">{user.pets.length}</TableCell>
                        <TableCell>
                          <Badge
                            className={
                              user.status === "Active"
                                ? "pixel-title bg-primary text-primary-foreground"
                                : "pixel-title bg-destructive text-destructive-foreground"
                            }
                          >
                            {user.status}
                          </Badge>
                        </TableCell>
                        <TableCell className="pixel-title text-foreground">{user.joinDate}</TableCell>
                        <TableCell>
                          <div className="flex space-x-2">
                            <Button
                              size="sm"
                              className="pixel-button"
                              onClick={() => handleUserAction(user.id, "view")}
                            >
                              <Eye className="h-3 w-3" />
                            </Button>
                            <Button
                              size="sm"
                              className="pixel-button bg-destructive border-destructive"
                              onClick={() => handleUserAction(user.id, "delete")}
                            >
                              <Trash2 className="h-3 w-3" />
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
                        <span className="text-sm pixel-title text-accent">EMAIL:</span>
                        <p className="pixel-title text-foreground">{selectedUserData.email}</p>
                      </div>
                      <div>
                        <span className="text-sm pixel-title text-accent">LEVEL:</span>
                        <p className="pixel-title text-foreground">{selectedUserData.level}</p>
                      </div>
                      <div>
                        <span className="text-sm pixel-title text-accent">STATUS:</span>
                        <Badge
                          className={
                            selectedUserData.status === "Active"
                              ? "pixel-title bg-primary text-primary-foreground"
                              : "pixel-title bg-destructive text-destructive-foreground"
                          }
                        >
                          {selectedUserData.status}
                        </Badge>
                      </div>
                      <div>
                        <span className="text-sm pixel-title text-accent">JOINED:</span>
                        <p className="pixel-title text-foreground">{selectedUserData.joinDate}</p>
                      </div>
                      <Button
                        className="pixel-button bg-destructive border-destructive w-full mt-4"
                        onClick={() => handleUserAction(selectedUserData.id, "delete")}
                      >
                        <Trash2 className="h-4 w-4 mr-2" />► DELETE USER ◄
                      </Button>
                    </CardContent>
                  </Card>

                  {/* User's Pets */}
                  <Card className="lg:col-span-2 pixel-card">
                    <CardHeader>
                      <CardTitle className="text-lg pixel-title-enhanced text-accent">► USER'S ALIEN PETS ◄</CardTitle>
                      <CardDescription className="pixel-title text-foreground">
                        {selectedUserData.pets.length} pets in collection
                      </CardDescription>
                    </CardHeader>
                    <CardContent>
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        {selectedUserData.pets.map((pet) => (
                          <div key={pet.id} className="pixel-card p-4">
                            <div className="flex items-center justify-between mb-2">
                              <h3 className="font-semibold pixel-title text-foreground">► {pet.name} ◄</h3>
                              <Badge
                                className={
                                  pet.mood === "CALM"
                                    ? "pixel-title bg-primary text-primary-foreground"
                                    : pet.mood === "ANGRY"
                                      ? "pixel-title bg-destructive text-destructive-foreground"
                                      : "pixel-title bg-secondary text-secondary-foreground"
                                }
                              >
                                {pet.mood}
                              </Badge>
                            </div>
                            <p className="text-sm pixel-title text-foreground mb-3">SPECIES: {pet.species}</p>
                            <Button
                              size="sm"
                              className="pixel-button bg-destructive border-destructive"
                              onClick={() => handlePetDelete(selectedUserData.id, pet.id)}
                            >
                              <Trash2 className="h-3 w-3 mr-1" />
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
