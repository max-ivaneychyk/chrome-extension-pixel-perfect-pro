import React, { useState, useEffect } from "react";
import Draggable from 'react-draggable';
import { toNumber } from "../../utils";

const ImageLayer = ({ x, y, scale, visible, width: savedWidth, useWidth, inversion, alignVertical, opacity, onChangePosition, lock, file, center }) => {
  const [ width, updateWidth ] = useState(0);
  const style = {
    transform: `translateY(${ alignVertical ? -50 : 0 }%)`,
    position: 'relative',
    transformOrigin: alignVertical ? 'center top' : '',
    textAlign: center ? 'center' : "left",
    display: 'inline-block',
    top: alignVertical ? '50vh' : '',
    opacity,
    lineHeight: 0,
    width: center ? '100vw' : ''
  };

  const imageWrapStyle = {
    position: alignVertical ? 'fixed' : 'absolute',
    top: '0',
    pointerEvents: lock ? 'none' : '',
    left: '0',
    cursor: 'move',
  };

  const imageStyle = {
    width: `${useWidth ? savedWidth : toNumber(scale * width)}`,
    height: 'auto',
    maxWidth: 'initial',
    pointerEvents: 'none',
    filter: `invert(${ inversion }%)`
  };

  if (imageStyle.width) {
    imageStyle.width += "px"
  }

  useEffect(() => {

    if (file) {
      const img = new Image();

      img.onload = () => {
        updateWidth(img.width);
      }

      img.src = file.href;

    }
  }, [ file ]);

  const handleStop = (_, { x, y }) => {
    const state = {};

    if (!center) {
      state.x = toNumber(x);
    }

    if (!alignVertical) {
      state.y = toNumber(y);
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

  const getCursor = () => {
    if (center && alignVertical) {
      return 'auto'
    } else if (alignVertical) {
      return 'e-resize'
    } else if (center) {
      return 'n-resize'
    }

    return 'move'
  };

  style.cursor = getCursor();

  const position = {
    x: center ? 0 : x,
    y: alignVertical ? 0 : y
  };

  return (
    <Draggable
      position={ position }
      axis={ getAxis() }
      onStop={ handleStop }
      disabled={ lock }
    >
      <div style={ imageWrapStyle }>
        <div style={ style }>
          {
            file &&
            <img
              src={ file.href }
              alt={ file.name }
              style={ imageStyle }
            />
          }
        </div>
      </div>
    </Draggable>
  )
}

export default ImageLayer
