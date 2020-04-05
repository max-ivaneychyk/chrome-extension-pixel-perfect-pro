import React from "react";
import Dropzone from 'react-dropzone'
import './index.scss'
import Label from "../Label";

const filterImages = files => {
  return files.filter(file => file.type.includes('image/'));
}

const DropZone = ({ onDrop }) => {
  const handleDrop = files => {
    onDrop(filterImages(files));
  }

  return (
    <Dropzone onDrop={ handleDrop }>
      { ({ getRootProps, getInputProps }) => (
        <section className={ 'DropZone' }>
          <div { ...getRootProps() }>
            <input
              { ...getInputProps() }
              accept={ 'image/*' }
            />
            <Label>Drag 'n' drop images here, or click to select images </Label>
          </div>
        </section>
      ) }
    </Dropzone>
  )
}

export default DropZone