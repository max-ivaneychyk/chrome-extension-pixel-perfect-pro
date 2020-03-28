import React from "react";
import Draggable from 'react-draggable';


const Image = ({ x, y, scale, opacity, onChangePosition, file }) => {
  const style = {
    transform: `scale(${ scale }, ${ scale })`,
    background: 'grey',
    position: 'relative',
    textAlign: "left",
    display: 'inline-block',
    opacity,
  };

  const handleStop = (_, { x, y }) => {
    onChangePosition({ x, y })
  }

  return (

    <Draggable
      position={ { x, y } }
      scale={ scale }
      onStop={ handleStop }
    >
      <div style={{
          position: 'absolute',
          top: '0',
          left: '0'
      }}>
        <div style={ style }>
          { file && <img src={ file.href } alt={ file.name } style={{
              pointerEvents: 'none'
          }}/> }
        </div>
      </div>
    </Draggable>
  )
}

export default Image