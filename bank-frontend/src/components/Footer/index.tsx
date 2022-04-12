import classes from "./Footer.module.scss"
import Image from "next/image"

type Props ={
  children: React.ReactNode
}

const Footer: React.FunctionComponent = (props: Props) => {
  return (
    <footer className={classes.root}>
      <Image src="/img/logo_pix.png" alt="Codepix"  width={146} height={32}/>
  
    </footer>
  )
}

export default Footer