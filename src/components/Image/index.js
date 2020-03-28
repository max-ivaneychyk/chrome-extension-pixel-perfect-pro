import React from "react";
import Draggable from 'react-draggable';


const Image = ({ x, y, scale, opacity, onChangePosition, lock, file, center = true}) => {
  const style = {
    transform: `scale(${ scale }, ${ scale })`,
    background: 'grey',
    position: 'relative',
    textAlign: "left",
    display: 'inline-block',
    opacity,
  };

  const imageWrapStyle = {
    position: 'absolute',
    top: '0',
    pointerEvents: lock ? 'none' : '',
    left: '0'
  }

  const handleStop = (_, { x, y }) => {
    onChangePosition({ x, y })
  }

  return (
    <Draggable
      position={ { x, y } }
      scale={ scale }
      axis={center ? 'y' : undefined}
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