import React from "react";
import { IoIosCloseCircleOutline, IoIosArrowDropup, IoIosArrowDropdown, IoIosArrowRoundBack, IoIosArrowRoundDown } from "react-icons/io";
import { GoComment } from "react-icons/go";
import './index.scss'
import { joinClasses } from "../../utils";
import DropZone from "../DropZone";
import Icon from "../Icon";
import { useStorageValue } from "../../hooks/useSettings";
import { APP_KEY, EXTENSION_SETTINGS } from "../../const/app";
import ReactTooltip from "react-tooltip"
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
};

const PreviewList = ({ images, selected, onDelete, onDrop, onSelect }) => {
  const [ isVisible, toggle ] = useStorageValue(APP_KEY, 'showLayers', EXTENSION_SETTINGS.showLayers);
  const [ positionSide, togglePosition ] = useStorageValue(APP_KEY, 'position', EXTENSION_SETTINGS.position);
  const handleToggle = () => toggle(!isVisible);
  const handleChangePosition = () => togglePosition(positionSide ? "" : "left");
  const handleAddFeedback = () => {
    const href = "https://forms.gle/RCQD2eTduLZxiN2XA";
    window.open(href)
  };

  return (
    <div className={ joinClasses(`PreviewList to-${positionSide}`, !isVisible ? 'hidden-list' : '') }>

      <Icon
        size={ 26 }
        onClick={ handleToggle }
        className={ 'ToggleBtn' }
        title={ 'Show/Hide all layers' }
        Component={ isVisible ? IoIosArrowDropdown : IoIosArrowDropup }
        active
      />

      <Icon
        size={ 26 }
        onClick={ handleChangePosition }
        className={ 'PositionBtn' }
        title={ 'Position left/bottom' }
        Component={ positionSide ? IoIosArrowRoundDown : IoIosArrowRoundBack }
        active
      />

      <Icon
        size={ 26 }
        onClick={ handleAddFeedback }
        className={ 'FeedbackBtn' }
        title={ 'Help us to improve the extension. Leave feedback' }
        Component={ GoComment }
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
          images.map(({ href, name, file }, index) => (
              <div
                className={ joinClasses(
                  'Preview',
                  selected === images[index] ? 'active-layer' : ''
                ) }
                key={ name }
                onClick={ () => onSelect(images[index]) }>

                <img src={ href } alt={ '' }  data-tip={""} data-for={`im-${index}`}/>
                <ReactTooltip
                  id={`im-${index}`}
                  place={!positionSide ? "top" : 'right'}
                  effect='solid'
                  offset={{
                    top: !positionSide ? 8 : 0,
                    left: positionSide ? -8 : 0
                  }}
                  className='extraTooltipClass'>
                  <span>{file.name}</span>
                </ReactTooltip>

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