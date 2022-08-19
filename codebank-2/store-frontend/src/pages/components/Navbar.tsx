import { AppBar, Button, Toolbar, Typography } from "@material-ui/core"
import { Store } from "@material-ui/icons"
import Link from "next/link"

export const Navbar: React.FunctionComponent = () => {
  return (
    <AppBar position="static">
      <Toolbar>
        <Link href={"/"} as={`/`} passHref>
          <Button color="inherit" startIcon={<Store />} component="a">
            <Typography variant='h6'>Code Store</Typography>
          </Button>
        </Link>
      </Toolbar>
    </AppBar>
  )
}