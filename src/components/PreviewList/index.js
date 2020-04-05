import React from "react";
import { IoIosCloseCircleOutline, IoIosArrowDropup, IoIosArrowDropdown } from "react-icons/io";
import './index.scss'
import { joinClasses } from "../../utils";
import DropZone from "../DropZone";
import Icon from "../Icon";
import useSettings from "../../hooks/useSettings";
import { APP_KEY, EXTENSION_SETTINGS } from "../../const/app";

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
  const [ { showLayers: isVisible }, { updateByKey } ] = useSettings(APP_KEY, EXTENSION_SETTINGS)
  const toggle = updateByKey('showLayers')
  const handleToggle = () => toggle(!isVisible);

  return (
    <div className={ joinClasses('PreviewList', !isVisible ? 'hidden-list' : '') }>

      <Icon
        size={ 26 }
        onClick={ handleToggle }
        className={ 'ToggleBtn' }
        title={ 'Show/Hide all layers' }
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
                  inactiveColor={ 'var(--danger-color)' }
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