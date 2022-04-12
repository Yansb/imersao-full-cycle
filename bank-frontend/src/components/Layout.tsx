import Image from "next/image"
import { ReactChild, ReactNode } from "react"
import { BankAccount } from "../model"
import Footer from "./Footer"
import MainContent from "./MainContent"
import Navbar from "./NavBart"

interface LayoutProps{
  bankAccount?: BankAccount;
  children: ReactChild | ReactNode;
}

const Layout: React.FunctionComponent<LayoutProps> = ({children,bankAccount }) => {
  return(
    <>
    <Navbar bankAccount={bankAccount}/>
    <MainContent>
      <div className="container">
        {children}
      </div>
    </MainContent>
    <Footer></Footer>
    </>
  )
}
export default Layout