import React from "react";
import { joinClasses } from "../../utils";
import './index.scss'


const Icon = ({ onClick, Component, size = 16, active, className, style, title, inactiveColor = 'var(--grey-icon-color)', activeColor = 'var(--primary-color)' }) => {
  return (
    <button
      style={ style }
      onClick={ onClick }
      className={ joinClasses('IconWrap', className) }
      title={ title }>
      <Component
        size={ size }
        color={ active ? activeColor : inactiveColor }
      />
    </button>
  )
}

export default Icon