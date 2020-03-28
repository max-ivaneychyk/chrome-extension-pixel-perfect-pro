import React from "react";
import Dropzone from 'react-dropzone'


const DropZone = ({onDrop}) => {

    return (
        <Dropzone onDrop={onDrop}>
            {({getRootProps, getInputProps}) => (
                <section>
                    <div {...getRootProps()}>
                        <input {...getInputProps()} />
                        <p>Drag 'n' drop some files here, or click to select files</p>
                    </div>
                </section>
            )}
        </Dropzone>
    )
}

export default DropZone