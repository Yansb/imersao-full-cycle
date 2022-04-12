import { useContext } from "react";
import BankContext from "../../context/BankContext";
import { BankAccount } from "../../model";
import classes from "./BankAccountCard.module.scss"

interface BankAccountCardProps {
  bankAccount: BankAccount
}

const BankAccountCard:React.FC<BankAccountCardProps> = ({bankAccount}) => {
  const bank = useContext(BankContext);


  return (
    <article key={bankAccount.id} className={`${classes.root} ${classes[bank.cssCode]}`}>
      <div>
        <h2 className={classes.ownerName}>{bankAccount.owner_name}</h2>
        <p className={`${classes.accountNumber} ${classes[bank.cssCode]}`}>{bankAccount.account_number}</p>
      </div>
      <span className={`fas fa-chevron-right ${classes.iconRight} ${classes[bank.cssCode]}`} />
    </article>
  )
}

export default BankAccountCard;