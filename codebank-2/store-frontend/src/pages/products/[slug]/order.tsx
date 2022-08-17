import {
  Typography,
  ListItem,
  ListItemAvatar,
  Avatar,
  ListItemText,
  TextField,
  Button,
  Grid,
  Box,
} from "@material-ui/core";
import Head from "next/head";
import Link from "next/link";
import { GetServerSideProps, NextPage } from "next";
import { useRouter } from "next/router";
import axios from "axios";
import { Product } from "../../../model";
import { http } from "../../../http";

interface OrderPageProps{
  product: Product;
}

const OrderPage: NextPage<OrderPageProps> = ({product}) => {
  const router = useRouter();

  if(router.isFallback){
    return <div>Carregando...</div>
  }

  return (
    <div>
      <Head>
        <title>Pagamento</title>
      </Head>
      <Typography component="h1" variant="h3" color="textPrimary" gutterBottom>
        Checkout
      </Typography>
      <ListItem>
        <ListItemAvatar>
          <Avatar src={product.image_url} />
        </ListItemAvatar>
        <ListItemText 
          primary={product.name}
          secondary={`R$ ${product.price}`}
        />
      </ListItem>
      <Typography component="h2" variant="h5" gutterBottom>
        Pague com seu cartão de credito
      </Typography>
      <form >
        <Grid container spacing={3}>
          <Grid item xs={12} md={6}>
            <TextField required label="Nome" fullWidth/>
          </Grid>
          <Grid item xs={12} md={6}>
            <TextField inputProps={{maxLength: 16}} required label="Numero do cartão" fullWidth/>
          </Grid>
          <Grid item xs={12} md={6}>
            <TextField type="number" required label="CVV" fullWidth/>
          </Grid>
          <Grid item xs={12} md={6}>
            <Grid container spacing={3}>
              <Grid item xs={6}>
                <TextField type="number" required label="Expiração mês" fullWidth/>
              </Grid>
              <Grid item xs={6}>
                <TextField type="number" required label="Expiração ano" fullWidth/>
              </Grid>
            </Grid>
          </Grid>
        </Grid>
        <Box marginTop={3}>
          <Button type="submit" variant="contained" fullWidth color="primary">
            Pagar
          </Button>
        </Box>
      </form>

    </div>
  );
};

export default OrderPage;

export const getServerSideProps: GetServerSideProps<OrderPageProps, {slug: string}> = async (context) => {
  const { slug } = context.params!;
  try {
    const {data: product} = await http.get(`products/${slug}`);
    return {
      props: {
        product,
      },
    }
  } catch (error) {
    if(axios.isAxiosError(error) && error?.response?.status === 404){
      return {notFound: true}
    }
    throw error;
  }
}