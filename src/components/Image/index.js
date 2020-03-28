import React from "react";
import Draggable from 'react-draggable';


const Image = ({ x, y, scale, opacity, onChangePosition, lock, file, center }) => {
  const style = {
    transform: `scale(${ scale }, ${ scale })`,
    position: 'relative',
    textAlign: center ? 'center' : "left",
    display: 'inline-block',
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
    const state = { y };

    if (!center) {
      state.x = x;
    }

    onChangePosition(state)
  }

  return (
    <Draggable
      position={ { x: center ? 0 : x, y } }
      scale={ scale }
      axis={ center ? 'y' : 'both' }
      onStop={ handleStop }
      disabled={ lock }
    >
      <div style={ imageWrapStyle }>
        <div style={ style }>
          { file && <img src={ file.href } alt={ file.name } style={ {
            pointerEvents: 'none'
          } }/> }
        </div>
      </div>
    </Draggable>
  )
}

export default Image