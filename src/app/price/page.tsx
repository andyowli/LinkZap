import Link from "next/link";
import { Check } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Navbar } from "@/components/navbar";
import { Footer } from "@/components/footer";

export default function PricePage() {
  const pricingPlans = [
    {
        name: "Basic",
        price: "$5.9",
        period: "/month",
        description: "Basic Listing",
        features: [
            "There are 3 dofollow links on our website to improve your SEO", 
            "No need to wait, list your products immediately", 
            "Update directory information at any time"
        ],
        buttonText: "Submit",
        buttonVariant: "outline" as const,
        popular: false,
    },
    {
        name: "Professional",
        price: "$9.9",
        period: "/month",
        description: "Featured Listing",
        features: [
            "There are 3 dofollow links on our website to improve your SEO", 
            "No need to wait, list your products immediately", 
            "Update directory information at any time", 
            "Display at featured locations",
            "Customer support"
        ],
        buttonText: "Submit",
        buttonVariant: "default" as const,
        popular: true,
    },
    {
        name: "Sponsor",
        price: "$19.9",
        period: "/month",
        description: "Sponsors and Advertisers",
        features: [
            "All contents in the Pro plan", 
            "Share your products on social media", 
            "Promote your product on almost every page", 
            "High quality customer support"
        ],
        buttonText: "Submit",
        buttonVariant: "outline" as const,
        popular: false,
    },
  ]

  return (
    <main className="min-h-screen flex flex-col">
      {/* Header */}
      <Navbar />

      {/* Hero Section */}
      <section className="pt-32 pb-16 px-4">
        <div className="container mx-auto text-center">
          <h1 className="h-11 text-2xl md:text-4xl font-bold mb-2 bg-gradient-to-r from-gray-800 to-gray-600 bg-clip-text text-transparent">
            Choose the solution that suits you
          </h1>
          <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
            We offer flexible pricing solutions to meet your different needs
          </p>
        </div>
      </section>

      {/* Pricing Section */}
      <section className="py-12 px-4">
        <div className="container mx-auto max-w-6xl">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {pricingPlans.map((plan, index) => (
              <Card
                key={index}
                className={`flex flex-col h-full ${
                  plan.popular ? "border-blue-400 shadow-lg scale-105 relative z-10" : ""
                }`}
              >
                {plan.popular && (
                  <div className="absolute -top-4 left-0 right-0 flex justify-center">
                    <span className="text-primary-foreground text-sm font-medium px-3 py-1 rounded-full bg-[#409eff]">
                      POPULAR
                    </span>
                  </div>
                )}
                <CardHeader>
                  <CardTitle>{plan.name}</CardTitle>
                  <div className="mt-4 flex items-baseline">
                    <span className="text-3xl  text-[#409eff] font-bold">{plan.price}</span>
                    {plan.period && <span className="text-muted-foreground ml-1">{plan.period}</span>}
                  </div>
                  <CardDescription className="mt-2]">{plan.description}</CardDescription>
                </CardHeader>
                <CardContent className="flex-grow">
                  <ul className="space-y-3">
                    {plan.features.map((feature, i) => (
                      <li key={i} className="flex items-start">
                        <Check className="h-5 w-5 text-[#409eff] flex-shrink-0 mr-2" />
                        <span className="text-sm">{feature}</span>
                      </li>
                    ))}
                  </ul>
                </CardContent>
                <CardFooter>
                  <Button className={`w-full rounded-full ${
                        index === 1
                        ? "bg-[#409eff] hover:bg-[#409eff]/90 text-white"
                        : "bg-white text-black border border-gray-200 hover:bg-[#409eff]/90 hover:text-white"
                    }`}>
                    {plan.buttonText}
                  </Button>
                </CardFooter>
              </Card>
            ))}
          </div>
        </div>
      </section>

      {/* FAQ Section */}
      <section className="py-16 px-4">
        <div className="container mx-auto max-w-4xl">
          <h1 className="text-2xl font-bold mb-8 text-center">frequently asked questions</h1>
          <div className="space-y-6">
            <div className="bg-background p-6 rounded-lg shadow-sm">
              <h3 className="text-lg font-medium mb-2">What are the benefits of the Basic plan?</h3>
                <ul className="text-muted-foreground text-sm list-disc px-4">
                  <li>There are 3 dofollow links on our website to improve your SEO</li>
                  <li>No need to wait, list your products immediately</li>
                  <li>Update directory information at any time</li>
                </ul>
            </div>
            <div className="bg-background p-6 rounded-lg shadow-sm">
              <h3 className="text-lg font-medium mb-2">The differences between Basic and Pro plans?</h3>
              <p className="text-muted-foreground text-sm">
                Display at featured locations,and Customer support
              </p>
            </div>
            <div className="bg-background p-6 rounded-lg shadow-sm">
              <h3 className="text-lg font-medium mb-2">What additional options do I offer to sponsors?</h3>
              <p className="text-muted-foreground">
                In addition to all the content in the professional plan, we also offer the following:
              </p>
              <ul className="text-muted-foreground text-sm list-disc px-4">
                <li>
                  Share your products on social media
                </li>
                <li>
                  Promote your product on almost every page
                </li>
                <li>
                  High quality customer support
                </li>
              </ul>
            </div>
          </div>
        </div>
      </section>

      {/* Footer */}
      <Footer />
    </main>
  )
}
