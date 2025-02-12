"use client"

import { useState, useEffect } from "react"
import { Canvas } from "@react-three/fiber"
import { OrbitControls, Sphere, MeshDistortMaterial } from "@react-three/drei"
import { Button } from "@/components/ui/button"

export default function Hero() {
  const [isConnected, setIsConnected] = useState(false)
  const [userAddress, setUserAddress] = useState("")
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    checkConnection()
  }, [])

  async function checkConnection() {
    if (typeof window.ethereum !== "undefined") {
      try {
        const accounts = await window.ethereum.request({ method: "eth_accounts" })
        if (accounts.length > 0) {
          setIsConnected(true)
          setUserAddress(accounts[0])
        }
      } catch (error) {
        console.error("An error occurred while checking the connection:", error)
      }
    }
  }

  async function connectWallet() {
    if (typeof window.ethereum !== "undefined" || typeof window.ethereum?.providers !== "undefined") {
      try {
        let provider
        if (typeof window.ethereum !== "undefined") {
          provider = window.ethereum
        } else if (typeof window.ethereum?.providers !== "undefined") {
          const providers = window.ethereum.providers
          provider = providers.find((p: any) => p.isMetaMask) || providers[0]
        }

        if (!provider) {
          throw new Error("No Ethereum wallet found")
        }

        await provider.request({ method: "eth_requestAccounts" })
        setIsConnected(true)
        const accounts = await provider.request({ method: "eth_accounts" })
        setUserAddress(accounts[0])
      } catch (error) {
        console.error("An error occurred while connecting the wallet:", error)
        setError("Failed to connect wallet. Please try again.")
      }
    } else {
      setError("Please install MetaMask or use a compatible mobile wallet!")
    }
  }

  return (
    <div className="relative h-screen flex items-center justify-center overflow-hidden">
      <div className="absolute inset-0 z-0">
        <Canvas>
          <OrbitControls enableZoom={false} />
          <ambientLight intensity={1} />
          <directionalLight position={[3, 2, 1]} />
          <Sphere args={[1, 100, 200]} scale={2.5}>
            <MeshDistortMaterial color="#4B0082" attach="material" distort={0.5} speed={2} />
          </Sphere>
        </Canvas>
      </div>
      <div className="relative z-10 text-center">
        <h1 className="text-5xl font-bold mb-4">EduFinance</h1>
        <p className="text-xl mb-8">Empowering Education Through Blockchain</p>
        {error && <p className="text-red-500 mb-4">{error}</p>}
        {isConnected ? (
          <div>
            <p className="mb-4">
              Connected: {userAddress.slice(0, 6)}...{userAddress.slice(-4)}
            </p>
            <Button size="lg" className="bg-purple-600 hover:bg-purple-700">
              Get Started
            </Button>
          </div>
        ) : (
          <Button size="lg" className="bg-purple-600 hover:bg-purple-700" onClick={connectWallet}>
            Connect Wallet
          </Button>
        )}
      </div>
    </div>
  )
}

