import React from "react";
import './index.scss'

const Slider = ({ value, onChange }) => {
  return (
    <input
      type="range"
      min="1"
      max="100"
      value={ value }
      className="slider Slider"
      onChange={ onChange }/>
  )
}

export default Slider