import { ethers } from "ethers";

// ABI for the smart contract
const contractABI = [
  {
    inputs: [
      { internalType: "uint256", name: "loanId", type: "uint256" }
    ],
    name: "approveLoan",
    outputs: [],
    stateMutability: "nonpayable",
    type: "function"
  },
  {
    inputs: [
      { internalType: "uint256", name: "loanId", type: "uint256" }
    ],
    name: "confirmRepayment",
    outputs: [],
    stateMutability: "nonpayable",
    type: "function"
  },
  {
    inputs: [],
    stateMutability: "nonpayable",
    type: "constructor"
  },
  {
    anonymous: false,
    inputs: [
      { indexed: false, internalType: "address", name: "student", type: "address" },
      { indexed: false, internalType: "string", name: "name", type: "string" },
      { indexed: false, internalType: "string", name: "phoneNumber", type: "string" },
      { indexed: false, internalType: "bytes32", name: "idHash", type: "bytes32" }
    ],
    name: "KYCVerified",
    type: "event"
  },
  {
    anonymous: false,
    inputs: [
      { indexed: false, internalType: "uint256", name: "loanId", type: "uint256" },
      { indexed: false, internalType: "address", name: "student", type: "address" },
      { indexed: false, internalType: "uint256", name: "amount", type: "uint256" }
    ],
    name: "LoanApproved",
    type: "event"
  },
  {
    anonymous: false,
    inputs: [
      { indexed: false, internalType: "uint256", name: "loanId", type: "uint256" },
      { indexed: false, internalType: "address", name: "student", type: "address" },
      { indexed: false, internalType: "uint256", name: "amount", type: "uint256" },
      { indexed: false, internalType: "string", name: "mpesaNumber", type: "string" }
    ],
    name: "LoanRequested",
    type: "event"
  },
  {
    anonymous: false,
    inputs: [
      { indexed: false, internalType: "uint256", name: "loanId", type: "uint256" },
      { indexed: false, internalType: "address", name: "student", type: "address" },
      { indexed: false, internalType: "uint256", name: "amount", type: "uint256" }
    ],
    name: "RepaymentReceived",
    type: "event"
  },
  {
    inputs: [
      { internalType: "uint256", name: "amount", type: "uint256" },
      { internalType: "uint256", name: "repaymentAmount", type: "uint256" },
      { internalType: "uint256", name: "dueDate", type: "uint256" },
      { internalType: "string", name: "mpesaNumber", type: "string" }
    ],
    name: "requestLoan",
    outputs: [],
    stateMutability: "nonpayable",
    type: "function"
  },
  {
    inputs: [
      { internalType: "uint256", name: "loanId", type: "uint256" }
    ],
    name: "requestWithdrawal",
    outputs: [],
    stateMutability: "nonpayable",
    type: "function"
  },
  {
    inputs: [
      { internalType: "string", name: "name", type: "string" },
      { internalType: "string", name: "phoneNumber", type: "string" },
      { internalType: "bytes32", name: "idHash", type: "bytes32" }
    ],
    name: "submitKYC",
    outputs: [],
    stateMutability: "nonpayable",
    type: "function"
  },
  {
    inputs: [
      { internalType: "address", name: "student", type: "address" },
      { internalType: "string", name: "name", type: "string" },
      { internalType: "string", name: "phoneNumber", type: "string" },
      { internalType: "bytes32", name: "idHash", type: "bytes32" }
    ],
    name: "verifyKYC",
    outputs: [],
    stateMutability: "nonpayable",
    type: "function"
  },
  {
    anonymous: false,
    inputs: [
      { indexed: false, internalType: "uint256", name: "loanId", type: "uint256" },
      { indexed: false, internalType: "address", name: "student", type: "address" },
      { indexed: false, internalType: "uint256", name: "amount", type: "uint256" },
      { indexed: false, internalType: "string", name: "mpesaNumber", type: "string" }
    ],
    name: "WithdrawalRequested",
    type: "event"
  },
  {
    inputs: [],
    name: "admin",
    outputs: [
      { internalType: "address", name: "", type: "address" }
    ],
    stateMutability: "view",
    type: "function"
  },
  {
    inputs: [
      { internalType: "address", name: "", type: "address" }
    ],
    name: "kycDetails",
    outputs: [
      { internalType: "string", name: "name", type: "string" },
      { internalType: "string", name: "phoneNumber", type: "string" },
      { internalType: "bytes32", name: "idHash", type: "bytes32" },
      { internalType: "bool", name: "isVerified", type: "bool" }
    ],
    stateMutability: "view",
    type: "function"
  },
  {
    inputs: [],
    name: "loanCounter",
    outputs: [
      { internalType: "uint256", name: "", type: "uint256" }
    ],
    stateMutability: "view",
    type: "function"
  },
  {
    inputs: [
      { internalType: "uint256", name: "", type: "uint256" }
    ],
    name: "loans",
    outputs: [
      { internalType: "uint256", name: "id", type: "uint256" },
      { internalType: "address", name: "student", type: "address" },
      { internalType: "uint256", name: "amount", type: "uint256" },
      { internalType: "uint256", name: "repaymentAmount", type: "uint256" },
      { internalType: "uint256", name: "dueDate", type: "uint256" },
      { internalType: "bool", name: "isApproved", type: "bool" },
      { internalType: "bool", name: "isRepaid", type: "bool" },
      { internalType: "bool", name: "isWithdrawn", type: "bool" },
      { internalType: "string", name: "mpesaNumber", type: "string" }
    ],
    stateMutability: "view",
    type: "function"
  },
  {
    inputs: [
      { internalType: "address", name: "", type: "address" },
      { internalType: "uint256", name: "", type: "uint256" }
    ],
    name: "studentLoans",
    outputs: [
      { internalType: "uint256", name: "", type: "uint256" }
    ],
    stateMutability: "view",
    type: "function"
  }
];

// Contract address
const contractAddress = "0x1D5a25d8343F607c6c32f227be8bac3ca1A0fCfB";

// Get the contract instance
export async function getContract() {
  let provider;

  if (typeof window.ethereum !== "undefined") {
    // MetaMask (or other injected wallet) is available
    provider = new ethers.BrowserProvider(window.ethereum);
  } else if (typeof window.ethereum?.providers !== "undefined") {
    // MetaMask Mobile provides an array of providers
    const providers = window.ethereum.providers;
    const metamaskProvider = providers.find((p: any) => p.isMetaMask);
    if (metamaskProvider) {
      provider = new ethers.BrowserProvider(metamaskProvider);
    }
  }

  if (!provider) {
    throw new Error("No Ethereum wallet found. Please install MetaMask or use a compatible mobile wallet.");
  }

  try {
    await provider.send("eth_requestAccounts", []);
    const signer = await provider.getSigner();
    return new ethers.Contract(contractAddress, contractABI, signer);
  } catch (error) {
    console.error("Failed to get contract:", error);
    throw new Error("Failed to connect to the blockchain. Please check your wallet connection.");
  }
}

// Submit KYC details
export async function submitKYC(name: string, phoneNumber: string, idHash: string) {
  try {
    const contract = await getContract();
    const transaction = await contract.submitKYC(name, phoneNumber, ethers.encodeBytes32String(idHash));
    await transaction.wait(); // Wait for the transaction to be mined
    return transaction;
  } catch (error) {
    console.error("Error in submitKYC:", error);
    if (error instanceof Error) {
      throw new Error(`Failed to submit KYC: ${error.message}`);
    } else {
      throw new Error("An unknown error occurred while submitting KYC");
    }
  }
}

// Request a loan
export async function requestLoan(amount: number, repaymentAmount: number, dueDate: number, mpesaNumber: string) {
  try {
    const contract = await getContract();
    const transaction = await contract.requestLoan(amount, repaymentAmount, dueDate, mpesaNumber);
    await transaction.wait(); // Wait for the transaction to be mined
    return transaction;
  } catch (error) {
    console.error("Error in requestLoan:", error);
    if (error instanceof Error) {
      throw new Error(`Failed to request loan: ${error.message}`);
    } else {
      throw new Error("An unknown error occurred while requesting the loan");
    }
  }
}

// Get loan details
export async function getLoanDetails(loanId: number) {
  try {
    const contract = await getContract();
    const loanDetails = await contract.loans(loanId);
    return loanDetails;
  } catch (error) {
    console.error("Error in getLoanDetails:", error);
    throw new Error(`Failed to get loan details: ${error}`);
  }
}

// Get KYC details
export async function getKYCDetails(userId: string) {
  try {
    const contract = await getContract();
    const kycDetails = await contract.kycDetails(userId);
    return kycDetails;
  } catch (error) {
    console.error("Error in getKYCDetails:", error);
    throw new Error(`Failed to get KYC details: ${error}`);
  }
}

// Send money to M-Pesa
export async function sendMoneyToMpesa(amount: number, phoneNumber: string) {
  try {
    const contract = await getContract();
    const transaction = await contract.sendMoneyToMpesa(amount, phoneNumber);
    await transaction.wait(); // Wait for the transaction to be mined
    return transaction;
  } catch (error) {
    console.error("Error in sendMoneyToMpesa:", error);
    if (error instanceof Error) {
      throw new Error(`Failed to send money to Mpesa: ${error.message}`);
    } else {
      throw new Error("An unknown error occurred while sending money to Mpesa");
    }
  }
}