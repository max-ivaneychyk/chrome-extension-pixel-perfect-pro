import { joinClasses } from "../../utils";
import React from "react";
import './index.scss'

const Label = ({ children, className }) => {
  return (
    <p className={ joinClasses(className, 'AELabel') }>{ children }</p>
  )
}

export default Label