import React, { useEffect, useRef, useCallback } from "react";
import './index.scss'
import Slider from "../Slider";
import Input from "../Input";
import Label from "../Label";
import Draggable from "react-draggable";
import { IoIosArrowDown, IoIosArrowUp, IoIosMenu } from "react-icons/io";
import { FaLock, FaUnlock, FaRegEye, FaEyeSlash } from "react-icons/fa";
import { MdVerticalAlignCenter } from "react-icons/md";
import Icon from "../Icon";
import { joinClasses, toDecimal, toNumber } from "../../utils";
import { useStorageValue } from "../../hooks/useSettings";
import { APP_KEY, EXTENSION_SETTINGS } from "../../const/app";

const useResize = callback => {
  useEffect(() => {
    window.addEventListener('resize', callback)
    return () => window.removeEventListener('resize', callback)
  }, [ callback ])
};


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

const Controls = ({ x, y, scale, opacity, inversion, visible, lock, center, alignVertical, onChangeOpacity, onAlignVerticalCenter, onChangeInversion, onChangePosition, onAlignCenter, onChangeScale, onLock, onChangeVisibility }) => {
  const ref = useRef();

  const [ controlsX, updateX ] = useStorageValue(APP_KEY, 'controls.x', EXTENSION_SETTINGS.controls.x);
  const [ controlsY, updateY ] = useStorageValue(APP_KEY, 'controls.y', EXTENSION_SETTINGS.controls.y);
  const [ showAll, collapse ] = useStorageValue(APP_KEY, 'controls.collapse', EXTENSION_SETTINGS.controls.collapse);

  const onChange = ({ target: { value, name } }) => {
    onChangePosition({
      x,
      y,
      [name]: toNumber(value)
    })
  };

  const handleLock = () => {
    onLock(!lock)
  };

  const handleAlignCenter = () => {
    onAlignCenter(!center)
  };

  const handleAlignVertical = () => {
    onAlignVerticalCenter(!alignVertical)
  };

  const handleScale = ({ target: { value } }) => {
    onChangeScale(toDecimal(value))
  }

  const handleDragStop = (_, { x, y }) => {
    updateX(toNumber(x))
    updateY(toNumber(y))
  }

  const handleChangeVisible = () => {
    onChangeVisibility(!visible)
  }

  const handleCollapse = () => {
    collapse(!showAll)
  }

  const handleResize = useCallback(() => {
    if (!ref.current) {
      return
    }

    const { x, bottom } = ref.current.getBoundingClientRect();
    const y = document.body.offsetHeight - bottom;

    if (x < 0) {
      updateX(-(Math.abs(controlsX) + x));

    }

    if (y < 0) {
      updateY(Math.max(controlsY + y, 0));
    }
  }, [ updateY, updateX, controlsY, controlsX ]);

  useEffect(() => {
    handleResize()
  }, [ handleResize ]);

  useResize(handleResize);

  return (
    <Draggable
      position={ {x: controlsX, y: controlsY} }
      onStop={ handleDragStop }
      handle=".handleDraggable"
      bounds={ 'body' }
    >
      <div
        ref={ ref }
        className={ joinClasses('Controls', !showAll && 'full') }>

        <div className={ 'head' }>
          <Icon className={ 'handleDraggable' }
                Component={ IoIosMenu }
                title={ 'Change position' }
                size={ 22 }
          />

          <Icon
            Component={ visible ? FaRegEye : FaEyeSlash }
            onClick={ handleChangeVisible }
            active={ visible }
            title={ 'Show/Hide layer' }
            size={ 20 }
          />

          <Icon
            Component={ lock ? FaLock : FaUnlock }
            active={ lock }
            title={ 'Lock/Unlock layer' }
            onClick={ handleLock }
          />

          <Icon
            Component={ showAll ? IoIosArrowDown : IoIosArrowUp }
            title={ 'Toggle controls view' }
            onClick={ handleCollapse }
            active={ false }
            size={ 22 }
          />
        </div>

        <StopWheelScroll>

          <label>
            <Label>Left</Label>
            <Icon
              Component={ MdVerticalAlignCenter }
              size={ 22 }
              title={ 'Align center by X' }
              onClick={ handleAlignCenter }
              active={ center }
              style={ { transform: 'rotate(90deg)' } }
            />
            <Input value={ x } name={ 'x' } onChange={ onChange } disabled={ center }/>
          </label>

          <label>
            <Label>Top</Label>
            <Icon
              Component={ MdVerticalAlignCenter }
              size={ 22 }
              title={ 'Align center by Y' }
              onClick={ handleAlignVertical }
              active={ alignVertical }
            />
            <Input value={ y } name={ 'y' } onChange={ onChange } disabled={ alignVertical }/>
          </label>

          <label>
            <Label>Scale</Label>
            <Input value={ scale } step={ .1 } onChange={ handleScale }/>
          </label>

          <div className="slidecontainer">
            <Label>Opacity - { opacity }%</Label>
            <Slider value={ opacity } onChange={ onChangeOpacity }/>
          </div>

          <div className="slidecontainer">
            <Label>Inversion - { inversion }%</Label>
            <Slider value={ inversion } onChange={ onChangeInversion }/>
          </div>
        </StopWheelScroll>


      </div>
    </Draggable>
  )
};

export default Controls