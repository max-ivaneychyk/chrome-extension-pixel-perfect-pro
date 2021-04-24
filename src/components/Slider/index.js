import React from "react";
import './index.scss'

const Slider = ({ value, onChange }) => {
  const handleChange = ({ target: { value } }) => {
    onChange(parseInt(value, 10))
  };

  return (
    <input
      type="range"
      min="0"
      max="100"
      value={ value }
      className="AEslider AESlider"
      onChange={ handleChange }/>
  )
}

export default Slider