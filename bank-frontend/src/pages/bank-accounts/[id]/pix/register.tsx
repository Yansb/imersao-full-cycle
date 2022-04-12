import axios from "axios";
import { GetServerSideProps } from "next";
import Link from "next/link";
import { useRouter } from "next/router";
import { useForm } from "react-hook-form";
import Button from "../../../../components/Button";
import Card from "../../../../components/Card";
import FormButtonActions from "../../../../components/FormButtonActions";
import Input from "../../../../components/Input";
import Layout from "../../../../components/Layout";
import PixKeyCard from "../../../../components/PixKeyCard";
import Title from "../../../../components/Title";
import { BankAccount, PixKey, PixKeyKind } from "../../../../model";
import { bankHttp, localhttp } from "../../../../util/http";
import Modal from "../../../../util/modal";
import classes from "./PixRegister.module.scss";


interface PixKeysRegisterProps {
  pixKeys: PixKey[];
  bankAccount: BankAccount;
}

const PixRegister: React.FC<PixKeysRegisterProps> = ({pixKeys, bankAccount}) => {
  const {
    query: { id },
    push
  } = useRouter();

  const {register, handleSubmit} = useForm()

  async function onSubmit(data){


    try {
      await localhttp.post(`/bank-accounts/${id}/pix-keys`, data);
      Modal.fire({
        title: "chave cadastrada com successo",
        icon: "success"
      })
      push(`/bank-accounts/${id}`);  
    } catch (error) {
      console.error(error)
      Modal.fire({
        
        title: "Ocorreu um erro verifique o console",
        icon: "error"
      })
    }
  }

  return(
    <Layout bankAccount={bankAccount}>
      <div className="row">
        <div className="col-sm-6">
          <Title>Cadastrar chave Pix</Title>
          <Card>
            <form  onSubmit={handleSubmit(onSubmit)}>
              <p className={classes.kindInfo}>Escolha um tipo de chave</p>
              <Input
                name="kind"
                type="radio"
                labelText="CPF"
                value="cpf"
                {...register("kind")}
              />
              <Input
                name="kind"
                type="radio"
                labelText="E-mail"
                value="email"
                {...register("kind")}
              />
              <Input name="key" labelText="Digite a chave"  {...register("key")} />
              <FormButtonActions>
                <Button type="submit">Cadastrar</Button>
                <Link href="/bank-accounts/[id]" as={`/bank-accounts/${id}`}>
                  <Button type="button" variant="info">
                    Voltar
                  </Button>
                </Link>
              </FormButtonActions>
            </form>
          </Card>
        </div>
        <div className="col-sm-4 offset-md-2">
          <Title>Minhas chaves pix</Title>
          {pixKeys ? pixKeys.map((pixKey) => (

            <PixKeyCard key={pixKey.id} pixKey={pixKey}/>
          )) : <Title>Que tal registrar uma chave pix</Title>}
        </div>
      </div>
    </Layout>
  )
}

export default PixRegister;


export const getServerSideProps: GetServerSideProps = async (cxt) => {
  const {
    query: { id },
  } = cxt;
  const [{ data: bankAccount }, { data: pixKeys }] = await Promise.all([
    await bankHttp.get(`bank-accounts/${id}`),
    await bankHttp.get(`bank-accounts/${id}/pix-keys`),
  ]);

  return {
    props: {
      bankAccount,
      pixKeys
    },
  };
};