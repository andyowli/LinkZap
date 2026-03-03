import { Navbar } from "../../components/navbar-wrapper";
import PriceClient from "../../components/PriceClient";
import Banner from "../../components/banner";

export default function PricePage() {
  return (
    <main className="min-h-screen flex flex-col">
      <Banner />

      {/* Header */}
      <Navbar topClass="top-10" />
      
      {/* Client Component for Price Content */}
      <PriceClient />
    </main>
  )
}
