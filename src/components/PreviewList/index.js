import React, { useState } from "react";
import { IoIosCloseCircleOutline, IoIosArrowDropup, IoIosArrowDropdown } from "react-icons/io";
import './index.scss'
import { joinClasses } from "../../utils";

const PreviewList = ({ images, selected, onDelete, onSelect }) => {
  const [ isVisible, toggle ] = useState(false);
  const handleToggle = () => toggle(!isVisible);

  return (
    <div className={ joinClasses('PreviewList', !isVisible ? 'hidden' : '') }>
      <button className={ 'ToggleBtn' } onClick={ handleToggle } title={ 'Show screens' }>
        { isVisible ? <IoIosArrowDropdown size={ 26 }/> : <IoIosArrowDropup size={ 26 }/> }
      </button>
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
    </div>
  )
}

export default PreviewList