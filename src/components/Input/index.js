import { joinClasses } from "../../utils";
import React from "react";
import './index.scss'

const Input = ({ value, onChange, className, step, type = 'number', disabled, name }) => {
  return (
    <input
      name={ name }
      className={ joinClasses(className, 'Input') }
      value={ value }
      type={ type }
      disabled={ disabled }
      step={ step }
      onChange={ onChange }
    />
  )
}

export default Input