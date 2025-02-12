"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { submitKYC, requestLoan, sendMoneyToMpesa } from "@/utils/contractInteraction"

export default function HowItWorks() {
  const [name, setName] = useState("")
  const [phoneNumber, setPhoneNumber] = useState("")
  const [studentId, setStudentId] = useState<File | null>(null)
  const [idHash, setIdHash] = useState("")
  const [loanAmount, setLoanAmount] = useState("")
  const [repaymentAmount, setRepaymentAmount] = useState("")
  const [dueDate, setDueDate] = useState("")
  const [mpesaNumber, setMpesaNumber] = useState("")
  const [error, setError] = useState<string | null>(null)

  const handleFileChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      const file = e.target.files[0]
      setStudentId(file)

      try {
        const arrayBuffer = await file.arrayBuffer()
        const hashBuffer = await crypto.subtle.digest("SHA-256", arrayBuffer)
        const hashArray = Array.from(new Uint8Array(hashBuffer))
        const hashHex = hashArray.map((b) => b.toString(16).padStart(2, "0")).join("")
        setIdHash(hashHex)
      } catch (error) {
        console.error("Error hashing file:", error)
        setError("Failed to process the student ID. Please try again.")
      }
    }
  }

  const handleKYCSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setError(null)
    if (!studentId || !idHash) {
      setError("Please upload your student ID")
      return
    }
    try {
      await submitKYC(name, phoneNumber, idHash)
      alert("KYC submitted successfully!")
    } catch (error) {
      console.error("Error submitting KYC:", error)
      setError(error instanceof Error ? error.message : "An unknown error occurred while submitting KYC")
    }
  }

  const handleLoanRequest = async (e: React.FormEvent) => {
    e.preventDefault()
    setError(null)
    try {
      const dueDateTimestamp = Math.floor(new Date(dueDate).getTime() / 1000)
      await requestLoan(Number(loanAmount), Number(repaymentAmount), dueDateTimestamp, mpesaNumber)
      alert("Loan requested successfully!")

      // Simulate loan approval and M-Pesa disbursement
      // In a real-world scenario, this would be triggered by the admin after approval
      try {
        await sendMoneyToMpesa(mpesaNumber, Number(loanAmount))
        alert("Loan disbursed via M-Pesa!")
      } catch (mpesaError) {
        console.error("Error disbursing loan via M-Pesa:", mpesaError)
        setError("Error disbursing loan via M-Pesa. Please contact support.")
      }
    } catch (error) {
      console.error("Error requesting loan:", error)
      setError(error instanceof Error ? error.message : "An unknown error occurred while requesting the loan")
    }
  }

  return (
    <section className="py-20 px-4 bg-gray-900">
      <div className="max-w-4xl mx-auto">
        <h2 className="text-3xl font-bold text-center mb-12">How It Works</h2>

        {error && <div className="bg-red-500 text-white p-4 rounded-md mb-4">{error}</div>}

        <div className="mb-12">
          <h3 className="text-2xl font-semibold mb-4">Step 1: Submit KYC</h3>
          <form onSubmit={handleKYCSubmit} className="space-y-4">
            <div>
              <Label htmlFor="name">Name</Label>
              <Input id="name" value={name} onChange={(e) => setName(e.target.value)} required />
            </div>
            <div>
              <Label htmlFor="phoneNumber">Phone Number</Label>
              <Input id="phoneNumber" value={phoneNumber} onChange={(e) => setPhoneNumber(e.target.value)} required />
            </div>
            <div>
              <Label htmlFor="studentId">Student ID (Upload)</Label>
              <Input id="studentId" type="file" onChange={handleFileChange} required />
            </div>
            <Button type="submit">Submit KYC</Button>
          </form>
        </div>

        <div className="mb-12">
          <h3 className="text-2xl font-semibold mb-4">Step 2: Request a Loan</h3>
          <form onSubmit={handleLoanRequest} className="space-y-4">
            <div>
              <Label htmlFor="loanAmount">Loan Amount</Label>
              <Input
                id="loanAmount"
                type="number"
                value={loanAmount}
                onChange={(e) => setLoanAmount(e.target.value)}
                required
              />
            </div>
            <div>
              <Label htmlFor="repaymentAmount">Repayment Amount</Label>
              <Input
                id="repaymentAmount"
                type="number"
                value={repaymentAmount}
                onChange={(e) => setRepaymentAmount(e.target.value)}
                required
              />
            </div>
            <div>
              <Label htmlFor="dueDate">Due Date</Label>
              <Input id="dueDate" type="date" value={dueDate} onChange={(e) => setDueDate(e.target.value)} required />
            </div>
            <div>
              <Label htmlFor="mpesaNumber">M-Pesa Number</Label>
              <Input id="mpesaNumber" value={mpesaNumber} onChange={(e) => setMpesaNumber(e.target.value)} required />
            </div>
            <Button type="submit">Request Loan</Button>
          </form>
        </div>

        <div className="text-center mt-12">
          <p className="mb-4">After submitting your KYC and requesting a loan:</p>
          <ol className="list-decimal list-inside space-y-2 text-left">
            <li>Wait for admin approval</li>
            <li>Once approved, the loan will be disbursed to your M-Pesa number</li>
            <li>Repay your loan on time through M-Pesa</li>
          </ol>
        </div>
      </div>
    </section>
  )
}

