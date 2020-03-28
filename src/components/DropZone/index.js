import React from "react";
import Dropzone from 'react-dropzone'
import './index.scss'
import Label from "../Label";

const DropZone = ({ onDrop }) => {
  return (
    <Dropzone onDrop={ onDrop }>
      { ({ getRootProps, getInputProps }) => (
        <section className={'DropZone'}>
          <div { ...getRootProps() }>
            <input { ...getInputProps() } />
            <Label>Drag 'n' drop images here, or click to select images </Label>
          </div>
        </section>
      ) }
    </Dropzone>
  )
}

export default DropZone