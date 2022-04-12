import { ReactNode } from "react";
import classes from "./FormButtonActions.module.scss";

const FormButtonActions: React.FunctionComponent<{children: ReactNode}> = (props) => {
  return <div className={classes.root}>{props.children}</div>;
};

export default FormButtonActions;