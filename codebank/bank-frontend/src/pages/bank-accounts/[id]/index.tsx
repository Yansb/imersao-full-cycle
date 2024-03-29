import { BankAccountBalance } from "../../../components/BankAccountBalance"
import Layout from "../../../components/Layout"
import Title from "../../../components/Title"
import classes from "./BankAccountDashboard.module.scss";
import { BankAccount, Transaction } from "../../../model"
import Link, { LinkProps } from "next/link";
import React, { useContext } from "react";
import { bankHttp } from "../../../util/http";
import { GetServerSideProps, NextPage } from "next";
import { format, parseISO } from "date-fns";
import BankContext from "../../../context/BankContext";

interface ActionLinkProps extends LinkProps {
  children: React.ReactNode;
}

const ActionLink: React.FunctionComponent<ActionLinkProps> = (props) => {
  const { children, ...rest } = props;
  const bank = useContext(BankContext);

  return (
    <Link {...rest}>
      <a className={`${classes.actionLink} ${classes[bank.cssCode]}`}>{children}</a>
    </Link>
  );
};
interface HeaderProps {
  bankAccount: BankAccount;
}

const Header: React.FC<HeaderProps> = ({bankAccount}) => {
  return(
        <div className={`container ${classes.header}`}>
        <BankAccountBalance balance={bankAccount.balance} />
        <div className={classes.buttonActions}>
          <ActionLink
            href="/bank-accounts/[id]/pix/transactions/register"
            as={`/bank-accounts/${bankAccount.id}/pix/transactions/register`}
          >
            Realizar transferência
          </ActionLink>
          <ActionLink
            href={"/bank-accounts/[id]/pix/register"}
            as={`/bank-accounts/${bankAccount.id}/pix/register`}
          >
            Cadastrar chave pix
          </ActionLink>
        </div>
      </div>
  )
}

interface BankAccountDashboardProps {
  bankAccount: BankAccount;
  transactions: Transaction[];
}
const BankAccountDashboard: NextPage<BankAccountDashboardProps> = (props) => {
  const { bankAccount, transactions } = props;
  return (
    <Layout bankAccount={bankAccount} >
      <Header bankAccount={bankAccount} />
      <div>
        <h1 className={classes.titleTable}>Últimos lançamentos</h1>

        <table className={`table table-borderless table-striped ${classes.tableTransactions}`}>
          <thead>
            <tr>
              <th scope="col">Data</th>
              <th scope="col" colSpan={3}>
                Descrição
              </th>
              <th scope="col" className="text-right">
                Valor (R$)
              </th>
            </tr>
          </thead>
          <tbody>
            {transactions.map((t, key) => (
              <tr key={key}>
                <td>{format(parseISO(t.created_at), "dd/MM")}</td>
                <td colSpan={3}>{t.description}</td>
                <td className="text-right">
                  {t.amount.toLocaleString("pt-BR")}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </Layout>
  );
};

export default BankAccountDashboard;

export const getServerSideProps: GetServerSideProps = async (cxt) => {
  const {
    query: { id },
  } = cxt;
  const [{ data: bankAccount }, { data: transactions }] = await Promise.all([
    await bankHttp.get(`bank-accounts/${id}`),
    await bankHttp.get(`bank-accounts/${id}/transactions`),
  ]);

  return {
    props: {
      bankAccount,
      transactions
    },
  };
};