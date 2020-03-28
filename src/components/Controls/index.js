import React, { useEffect, useRef, useCallback } from "react";
import './index.scss'
import Slider from "../Slider";
import Input from "../Input";
import Label from "../Label";
import Draggable from "react-draggable";
import { IoIosMenu } from "react-icons/io";
import { FaLock } from "react-icons/fa";


const StopWheelScroll = ({ children }) => {
  const ref = useRef(null)

  const handleWheel = useCallback(event => {
    event.stopPropagation();
  }, []);

  useEffect(() => {
    ref.current.addEventListener('wheel', handleWheel, true);
  }, [ref, handleWheel])

  return (
    <div ref={ ref }>
      { children }
    </div>
  )
}

const Controls = ({ x, y, scale, opacity, onChangeOpacity, onChangePosition, onChangeScale }) => {
  const [ controlsPosition, updateControlsPosition ] = React.useState({ x: 0, y: 0 })

  const onChange = ({ target }) => {
    onChangePosition({ x, y, [target.name]: parseInt(target.value, 10) })
  }

  const handleScale = ({ target }) => {
    onChangeScale(parseInt(target.value, 10))
  }

  const handleOpacity = ({ target }) => {
    onChangeOpacity(parseInt(target.value, 10))
  }

  const handleDragStop = (_, { x, y }) => {
    updateControlsPosition({ x, y })
  }

  return (
    <Draggable
      position={ controlsPosition }
      onStop={ handleDragStop }
      handle=".handleDraggable"
    >
      <div className={ 'Controls' }>
        <div className={'head'}>

        <span className={ 'handleDraggable' }>
          <IoIosMenu size={ 22 }/>
        </span>

          <FaLock size={ 16 }/>
          <FaLock size={ 16 }/>
        </div>

        <StopWheelScroll>

          <label>
            <Input value={ x } name={ 'x' } onChange={ onChange }/>
            <Label>X</Label>
          </label>

          <label>
            <Input value={ y } name={ 'y' } onChange={ onChange }/>
            <Label>Y</Label>
          </label>

          <label>
            <Input value={ scale } step={ 1 } onChange={ handleScale }/>
            <Label>Scale</Label>
          </label>

          <div className="slidecontainer">
            <Label>Opacity</Label>
            <Slider value={ opacity } onChange={ handleOpacity }/>
          </div>
        </StopWheelScroll>


      </div>
    </Draggable>
  )
};

export default Controls