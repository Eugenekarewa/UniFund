import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Shield, Banknote, UserCheck } from "lucide-react"

export default function Features() {
  const features = [
    {
      title: "Secure KYC",
      description: "Verify your identity securely on the blockchain",
      icon: Shield,
    },
    {
      title: "Easy Loans",
      description: "Request and receive student loans with ease",
      icon: Banknote,
    },
    {
      title: "Transparent Process",
      description: "Track your loan status and repayments in real-time",
      icon: UserCheck,
    },
  ]

  return (
    <section className="py-20 px-4">
      <h2 className="text-3xl font-bold text-center mb-12">Why Choose EduFinance?</h2>
      <div className="grid grid-cols-1 md:grid-cols-3 gap-8 max-w-6xl mx-auto">
        {features.map((feature, index) => (
          <Card key={index} className="bg-gray-800 border-gray-700">
            <CardHeader>
              <feature.icon className="w-12 h-12 mb-4 text-purple-500" />
              <CardTitle>{feature.title}</CardTitle>
            </CardHeader>
            <CardContent>
              <CardDescription>{feature.description}</CardDescription>
            </CardContent>
          </Card>
        ))}
      </div>
    </section>
  )
}

