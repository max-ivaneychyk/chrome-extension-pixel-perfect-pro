import { joinClasses } from "../../utils";
import React from "react";
import './index.scss'

const Input = ({ value, onChange, min, max, className, step, type = 'number', disabled, name }) => {
  return (
    <input
      name={ name }
      className={ joinClasses(className, 'Input') }
      value={ value }
      type={ type }
      disabled={ disabled }
      step={ step }
      min={ min }
      max={ max }
      onChange={ onChange }
    />
  )
}

export default Input