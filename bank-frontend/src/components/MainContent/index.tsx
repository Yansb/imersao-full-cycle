import { ReactChild } from "react"
import classes from "./MainContent.module.scss"



const MainContent: React.FunctionComponent<{children: ReactChild}> = props => {
  return (
    <main>
      <div className={classes.root}>
        {props.children}
      </div>
    </main>
  )
}

export default MainContent