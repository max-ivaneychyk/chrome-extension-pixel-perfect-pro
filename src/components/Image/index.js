import React from "react";
import Draggable from 'react-draggable';


const Image = ({ x, y, scale, visible, inversion, alignVertical, opacity, onChangePosition, lock, file, center }) => {
  const style = {
    transform: `scale(${ scale }, ${ scale }) translateY(${ alignVertical ? -50 : 0 }%)`,
    position: 'relative',
    textAlign: center ? 'center' : "left",
    display: 'inline-block',
    top: alignVertical ? '50vh' : '',
    opacity,
    width: center ? '100vw' : ''
  };

  const imageWrapStyle = {
    position: 'absolute',
    top: '0',
    pointerEvents: lock ? 'none' : '',
    left: '0',
  }

  const handleStop = (_, { x, y }) => {
    const state = {};

    if (!center) {
      state.x = x;
    }

    if (!alignVertical) {
      state.y = y;
    }

    onChangePosition(state)
  };

  if (!visible) {
    return null
  }

  const getAxis = () => {
    if (center && alignVertical) {
      return 'none'
    } else if (alignVertical) {
      return 'x'
    } else if (center) {
      return 'y'
    }

    return 'both'
  };

  return (
    <Draggable
      position={ {
        x: center ? 0 : x,
        y: alignVertical ? 0 : y
      } }
      scale={ scale }
      axis={ getAxis() }
      onStop={ handleStop }
      disabled={ lock }
    >
      <div style={ imageWrapStyle }>
        <div style={ style }>
          { file && <img src={ file.href } alt={ file.name } style={ {
            pointerEvents: 'none',
            filter: `invert(${ inversion }%)`
          } }/> }
        </div>
      </div>
    </Draggable>
  )
}

export default Image