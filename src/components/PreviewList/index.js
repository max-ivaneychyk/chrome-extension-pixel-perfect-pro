import React, { useState } from "react";
import { IoIosCloseCircleOutline, IoIosArrowDropup, IoIosArrowDropdown } from "react-icons/io";
import './index.scss'
import { joinClasses } from "../../utils";
import DropZone from "../DropZone";

const ScrollArea = ({ children, speed = 0.2 }) => {
  const ref = React.useRef();
  const handleWheel = event => {
    const { deltaY } = event
    ref.current.scrollLeft = ref.current.scrollLeft + (deltaY * speed);
  };

  return (
    <div
      className={ 'ScrollArea' }
      ref={ ref }
      onWheel={ handleWheel }>
      { children }
    </div>
  )
}

const PreviewList = ({ images, selected, onDelete, onDrop, onSelect }) => {
  const [ isVisible, toggle ] = useState(true);
  const handleToggle = () => toggle(!isVisible);

  return (
    <div className={ joinClasses('PreviewList', !isVisible ? 'hidden' : '') }>
      <button className={ 'ToggleBtn' } onClick={ handleToggle } title={ 'Show screens' }>
        { isVisible ? <IoIosArrowDropdown size={ 26 }/> : <IoIosArrowDropup size={ 26 }/> }
      </button>

      <DropZone
        onDrop={ onDrop }
      />

      <ScrollArea>
        {
          images.map(({ href, name }, index) => (
              <div
                className={ joinClasses(
                  'Preview',
                  selected === images[index] ? 'active' : ''
                ) }
                key={ href }
                onClick={ () => onSelect(images[index]) }>
                <img src={ href } alt={ '' }/>
                <button onClick={ () => onDelete(name) }>
                  <IoIosCloseCircleOutline size={ 26 }/>
                </button>
              </div>
            )
          )
        }
      </ScrollArea>
    </div>
  )
}

export default PreviewList