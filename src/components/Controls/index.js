import React, { useEffect, useRef, useCallback, useState } from "react";
import './index.scss'
import Slider from "../Slider";
import Input from "../Input";
import Label from "../Label";
import Draggable from "react-draggable";
import { IoIosMenu } from "react-icons/io";
import { FaLock, FaUnlock } from "react-icons/fa";
import { AiOutlineColumnWidth } from "react-icons/ai";
import Icon from "../Icon";


const StopWheelScroll = ({ children }) => {
  const ref = useRef(null)

  const handleWheel = useCallback(event => {
    event.stopPropagation();
  }, []);

  useEffect(() => {
    ref.current.addEventListener('wheel', handleWheel, true);
  }, [ ref, handleWheel ])

  return (
    <div ref={ ref }>
      { children }
    </div>
  )
}

const Controls = ({ x, y, scale, opacity, lock, center, onChangeOpacity, onChangePosition, onAlignCenter, onChangeScale, onLock }) => {
  const [ controlsPosition, updateControlsPosition ] = useState({ x: 0, y: 0 })

  const onChange = ({ target }) => {
    onChangePosition({ x, y, [target.name]: parseInt(target.value, 10) })
  };

  const handleLock = () => {
    onLock(!lock)
  };

  const handleAlignCenter = () => {
    onAlignCenter(!center)
  };

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
      bounds={ 'body' }
    >
      <div className={ 'Controls' }>
        <div className={ 'head' }>

        <span className={ 'handleDraggable' }>
          <IoIosMenu size={ 22 }/>
        </span>

          <Icon
            Component={ AiOutlineColumnWidth }
            onClick={ handleAlignCenter }
            active={ center }
          />

          <Icon
            Component={ lock ? FaLock : FaUnlock }
            active={ lock }
            onClick={ handleLock }
          />
        </div>

        <StopWheelScroll>

          <label>
            <Input value={ x } name={ 'x' } onChange={ onChange } disabled={center}/>
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
            <Label>Opacity - { (opacity / 100).toFixed(2) }</Label>
            <Slider value={ opacity } onChange={ handleOpacity }/>
          </div>
        </StopWheelScroll>


      </div>
    </Draggable>
  )
};

export default Controls