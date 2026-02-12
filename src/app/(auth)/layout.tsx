import { Navbar } from "../../components/navbar-wrapper";
import { ReactNode } from "react";


const Layout = ({ children }: { children: ReactNode }) => {
  return (
    <>
      <Navbar />
      {children}
    </>
  )
}

export default Layout