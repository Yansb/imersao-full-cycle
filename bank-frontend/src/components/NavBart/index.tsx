// @flow
import { useContext } from "react";
import BankContext from "../../context/BankContext";
import { BankAccount } from "../../model";
import classes from "./Navbar.module.scss";

interface NavBarProps {
  bankAccount?: BankAccount;
}

const Navbar: React.FunctionComponent<NavBarProps> = ({bankAccount}) => {
  const bank = useContext(BankContext);

  return (
    <nav className={`navbar navbar-expand-lg ${classes.root} ${classes[bank.cssCode]}`}>
    <div className={`container-fluid ${classes.navbarBody}`}>
      <a className={`navbar-brand ${classes.navbarBrand}`} href="#">
        <img src="/img/icon_banco.png" alt="Ícone banco" className={classes.logoBank}  />
        <div className={classes.bankName}>
          <span>Code - 001</span>
          <h2>BBX</h2>
        </div>
        </a>
      
        {bankAccount && <div
            className={`collapse navbar-collapse ${classes.navbarRightRoot}`}
            id="navbarSupportedContent"
          >
            <ul className={`navbar-nav ${classes.navbarRightBody}`}>
              <li className={`nav-item ${classes.bankAccountInfo}`}>
                <img
                  src="/img/icon_user.png"
                  alt=""
                  className={classes.iconUser}
                />
                <p className={classes.ownerName}>
                  {bankAccount.owner_name} | C/C: {bankAccount.account_number}
                </p>
              </li>
            </ul>
          </div>}
    </div>
  </nav>
  );
};

export default Navbar;