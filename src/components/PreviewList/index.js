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
import {keyMap} from "../../const/keys";
const ScrollArea = ({ children, speed = 0.2 }) => {
  const ref = React.useRef();
  const handleWheel = event => {
    const { deltaY } = event
    ref.current.scrollLeft = ref.current.scrollLeft + (deltaY * speed);
  };

  return (
    <div
      className={ 'AEScrollArea' }
      ref={ ref }
      onWheel={ handleWheel }>
      { children }
    </div>
  )
};

const Preview = ({onDelete, selected, onSelect, image, positionSide, index}) => {
  const { href, name, file } = image;

  return (
    <div
      className={ joinClasses(
        'AEPreview',
        selected ? 'AEactive-layer' : ''
      ) }
      key={ name }
      onClick={ () => onSelect(image) }>

      <img src={ href } alt={ '' }  data-tip={""} data-for={`im-${index}`}/>
      <ReactTooltip
        id={`im-${index}`}
        place={!positionSide ? "top" : 'right'}
        effect='solid'
        offset={{
          top: !positionSide ? 8 : 0,
          left: positionSide ? -8 : 0
        }}
        className='AEextraTooltipClass'>
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
};

const PreviewList = ({ images, selected, onDelete, onDrop, onSelect, isVisible, toggle }) => {
  const [ positionSide, togglePosition ] = useStorageValue(APP_KEY, 'position', EXTENSION_SETTINGS.position);
  const handleToggle = () => toggle(!isVisible);
  const handleChangePosition = () => togglePosition(positionSide ? "" : "left");
  const handleAddFeedback = () => {
    const href = "https://forms.gle/RCQD2eTduLZxiN2XA";
    window.open(href)
  };

  return (
    <div className={ joinClasses(`AEPreviewList AEto-${positionSide}`, !isVisible ? 'AEhidden-list' : '') }>

      <Icon
        size={ 26 }
        onClick={ handleToggle }
        className={ 'AEToggleBtn' }
        title={ 'Show/Hide all layers : ' + keyMap.HIDE_PANEL }
        Component={ isVisible ? IoIosArrowDropdown : IoIosArrowDropup }
        active
      />

      <Icon
        size={ 26 }
        onClick={ handleChangePosition }
        className={ 'AEPositionBtn' }
        title={ 'Position left/bottom' }
        Component={ positionSide ? IoIosArrowRoundDown : IoIosArrowRoundBack }
        active
      />

      <Icon
        size={ 26 }
        onClick={ handleAddFeedback }
        className={ 'AEFeedbackBtn' }
        title={ 'Help us to improve the extension. Leave feedback' }
        Component={ GoComment }
        active
      />

      <DropZone
        onDrop={ onDrop }
      />

      {
        !images.length &&
        <p className={ 'AEEmptyListPlaceholder' }>
          No uploaded images
        </p>
      }

      <ScrollArea>
        {
          images.map((image, index) => (
              <Preview
                key={image.name}
                onSelect={onSelect}
                selected={image === selected}
                image={image}
                onDelete={onDelete}
                positionSide={positionSide}
                index={index}
              />
            )
          )
        }
      </ScrollArea>
    </div>
  )
};

export default PreviewList