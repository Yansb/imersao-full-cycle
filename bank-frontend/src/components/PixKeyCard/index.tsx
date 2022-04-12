import { useContext } from "react";
import BankContext from "../../context/BankContext";
import { PixKey } from "../../model";
import classes from "./PixKeyCard.module.scss"

interface PixKeyCard{
  pixKey: PixKey
}

const pixKeyKinds = {
  cpf: "CPF",
  email: "E-mail"
}

const PixKeyCard: React.FC<PixKeyCard> = ({pixKey}) => {
  const bank = useContext(BankContext);

  return <div className={`${classes.root} ${classes[bank.cssCode]}`}>
    <p className={classes.kind}>{pixKeyKinds[pixKey.kind]}</p>
    <span className={classes.key}>{pixKey.key}</span>
  </div>
}

export default PixKeyCard;