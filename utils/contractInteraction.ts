import { ethers } from "ethers"

const contractABI = [
  // ... (paste the entire ABI here)
]

const contractAddress = "0x1D5a25d8343F607c6c32f227be8bac3ca1A0fCfB"

export async function getContract() {
  let provider

  if (typeof window.ethereum !== "undefined") {
    // MetaMask (or other injected wallet) is available
    provider = new ethers.providers.Web3Provider(window.ethereum)
  } else if (typeof window.ethereum?.providers !== "undefined") {
    // MetaMask Mobile provides an array of providers
    const providers = window.ethereum.providers
    const metamaskProvider = providers.find((p: any) => p.isMetaMask)
    if (metamaskProvider) {
      provider = new ethers.providers.Web3Provider(metamaskProvider)
    }
  }

  if (!provider) {
    throw new Error("No Ethereum wallet found. Please install MetaMask or use a compatible mobile wallet.")
  }

  try {
    await provider.send("eth_requestAccounts", [])
    const signer = provider.getSigner()
    return new ethers.Contract(contractAddress, contractABI, signer)
  } catch (error) {
    console.error("Failed to get contract:", error)
    throw new Error("Failed to connect to the blockchain. Please check your wallet connection.")
  }
}

export async function submitKYC(name: string, phoneNumber: string, idHash: string) {
  try {
    const contract = await getContract()
    const transaction = await contract.submitKYC(name, phoneNumber, idHash)
    await transaction.wait() // Wait for the transaction to be mined
    return transaction
  } catch (error) {
    console.error("Error in submitKYC:", error)
    if (error instanceof Error) {
      throw new Error(`Failed to submit KYC: ${error.message}`)
    } else {
      throw new Error("An unknown error occurred while submitting KYC")
    }
  }
}

export async function requestLoan(amount: number, repaymentAmount: number, dueDate: number, mpesaNumber: string) {
  try {
    const contract = await getContract()
    const transaction = await contract.requestLoan(amount, repaymentAmount, dueDate, mpesaNumber)
    await transaction.wait() // Wait for the transaction to be mined
    return transaction
  } catch (error) {
    console.error("Error in requestLoan:", error)
    if (error instanceof Error) {
      throw new Error(`Failed to request loan: ${error.message}`)
    } else {
      throw new Error("An unknown error occurred while requesting the loan")
    }
  }
}

// Added getLoanDetails and getKYCDetails functions.  The exact implementation will depend on your contract ABI.
export async function getLoanDetails(loanId: number) {
  try {
    const contract = await getContract()
    const loanDetails = await contract.getLoanDetails(loanId)
    return loanDetails
  } catch (error) {
    console.error("Error in getLoanDetails:", error)
    throw new Error(`Failed to get loan details: ${error}`)
  }
}

export async function getKYCDetails(userId: number) {
  try {
    const contract = await getContract()
    const kycDetails = await contract.getKYCDetails(userId)
    return kycDetails
  } catch (error) {
    console.error("Error in getKYCDetails:", error)
    throw new Error(`Failed to get KYC details: ${error}`)
  }
}

export async function sendMoneyToMpesa(amount: number, phoneNumber: string) {
  try {
    const contract = await getContract()
    const transaction = await contract.sendMoneyToMpesa(amount, phoneNumber)
    await transaction.wait() // Wait for the transaction to be mined
    return transaction
  } catch (error) {
    console.error("Error in sendMoneyToMpesa:", error)
    if (error instanceof Error) {
      throw new Error(`Failed to send money to Mpesa: ${error.message}`)
    } else {
      throw new Error("An unknown error occurred while sending money to Mpesa")
    }
  }
}

export { getContract, submitKYC, getLoanDetails, getKYCDetails, sendMoneyToMpesa }

