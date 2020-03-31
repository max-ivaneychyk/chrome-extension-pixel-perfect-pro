import React from "react";
import { joinClasses } from "../../utils";
import './index.scss'


const Icon = ({ onClick, Component, size = 16, active, className, style, title }) => {
  return (
    <button
      style={ style }
      onClick={ onClick }
      className={ joinClasses('IconWrap', className) }
      title={ title }>
      <Component
        size={ size }
        color={ active ? 'var(--primary-color)' : 'var(--grey-icon-color)' }
      />
    </button>
  )
}

export default Icon