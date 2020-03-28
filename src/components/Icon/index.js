import React from "react";
import { joinClasses } from "../../utils";


const Icon = ({ onClick, Component, size = 16, active, className, title }) => {
  return (
    <button
      onClick={ onClick }
      className={ joinClasses('IconWrap', className) }
      title={ title }>
      <Component
        size={ size }
        color={ active ? 'var(--primary-color)' : 'var(--grey-color)' }
      />
    </button>
  )
}

export default Icon