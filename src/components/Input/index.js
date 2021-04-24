import { joinClasses } from "../../utils";
import React from "react";
import './index.scss'

const Input = ({ value = 0, placeholder, onChange, min, max, className, step, type = 'number', disabled, name }) => {
  return (
    <input
      placeholder={placeholder}
      name={ name }
      className={ joinClasses(className, 'AEInput') }
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