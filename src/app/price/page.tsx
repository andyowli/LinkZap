import { Navbar } from "../../components/navbar-wrapper";
import PriceClient from "../../components/PriceClient";

export default function PricePage() {
  return (
    <main className="min-h-screen flex flex-col">
      {/* Header */}
      <Navbar />
      
      {/* Client Component for Price Content */}
      <PriceClient />
    </main>
  )
}
