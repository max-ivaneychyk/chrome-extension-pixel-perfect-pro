import React, { useState } from "react";
import { IoIosCloseCircleOutline, IoIosArrowDropup, IoIosArrowDropdown } from "react-icons/io";
import './index.scss'
import { joinClasses } from "../../utils";
import DropZone from "../DropZone";
import Icon from "../Icon";

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
    <div className={ joinClasses('PreviewList', !isVisible ? 'hidden-list' : '') }>

      <Icon
        size={ 26 }
        onClick={ handleToggle }
        className={ 'ToggleBtn' }
        title={ 'Show screens' }
        Component={ isVisible ? IoIosArrowDropdown : IoIosArrowDropup }
        active
      />

      <DropZone
        onDrop={ onDrop }
      />

      {
        !images.length &&
        <p className={ 'EmptyListPlaceholder' }>
          No uploaded images
        </p>
      }

      <ScrollArea>
        {
          images.map(({ href, name }, index) => (
              <div
                className={ joinClasses(
                  'Preview',
                  selected === images[index] ? 'active-layer' : ''
                ) }
                key={ name }
                onClick={ () => onSelect(images[index]) }>

                <img src={ href } alt={ '' }/>

                <Icon
                  size={ 26 }
                  onClick={ (event) => {
                    event.stopPropagation();
                    onDelete(name);
                  } }
                  inactiveColor={'var(--danger-color)'}
                  Component={ IoIosCloseCircleOutline }
                />
              </div>
            )
          )
        }
      </ScrollArea>
    </div>
  )
}

export default PreviewList