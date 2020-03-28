import React, { useState, useEffect } from 'react';
import './App.scss';
import DropZone from "./components/DropZone";
import Image from "./components/Image";
import { HotKeys } from "react-hotkeys";
import Controls from "./components/Controls";
import * as Store from './store'
import PreviewList from "./components/PreviewList";

const keyMap = {
  TO_LEFT: [ "left", 'a' ],
  TO_RIGHT: [ "right", 'd' ],
  TO_UP: [ "up", 'w' ],
  TO_DOWN: [ "down", 's' ],
};


class ImageSource {
  constructor(file, name) {
    this.file = file;
    this.name = name;
    this.href = ImageSource.getBlobLink(file)
  }

  static getBlobLink = blob => {
    return URL.createObjectURL(blob)
  }
}

const useSettings = (initialState) => {
  const [ data, update ] = useState(initialState);
  const updateByKey = key => (val) => update({ ...data, [key]: val });
  const merge = newState => update({ ...data, ...newState });
  return [ data, { updateByKey, merge } ]
};

function App() {
  const [ files, updateFiles ] = useState([]);
  const [ file, updateFile ] = useState(null);

  const [ settings, updateSettings ] = useSettings({
    x: 0,
    y: 0,
    scale: 1,
    opacity: 100
  });
  const { x, y, opacity, scale } = settings;

  const { updateByKey, merge } = updateSettings;
  const updateScale = updateByKey('scale');
  const updateOpacity = updateByKey('opacity');
  const updateX = updateByKey('x');
  const updateY = updateByKey('y');

  const handleAttachFiles = newFiles => {
    const images = newFiles.map(file => new ImageSource(
      file, `${ Date.now() }:::${ file.name }`
      )
    )

    images.forEach(({ file, name }) => Store.set(name, file));

    updateFiles([
      ...files,
      ...images
    ]);
  };

  useEffect(() => {
    Store.getAll().then(files => {
      const images = files.map(([ key, file ]) => new ImageSource(file, key))
      updateFiles(images);
      updateFile(images[0] || null)
    })
  }, []);

  const handleDeleteImage = name => {
    Store.remove(name);
    updateFiles(files.filter(({ name: id }) => id !== name))
  }

  const handleSelectImage = (file) => {
    updateFile(file)
  }

  const handleMoveLeft = () => {
    updateX(x - 1)
  }

  const handleMoveRight = () => {
    updateX(x + 1)
  }

  const handleMoveUp = () => {
    updateY(y - 1)
  }

  const handleMoveDown = () => {
    updateY(y + 1)
  }

  const handlers = {
    TO_LEFT: handleMoveLeft,
    TO_RIGHT: handleMoveRight,
    TO_UP: handleMoveUp,
    TO_DOWN: handleMoveDown
  };

  const onChangePosition = ({ x, y }) => {
    merge({ x, y })
  }

  useEffect(() => {
    Store.getAll()
  }, [])

  return (
    <div className="App-Extension">
      <HotKeys keyMap={ keyMap } handlers={ handlers } allowChanges>

        <Image
          x={ x }
          y={ y }
          scale={ scale }
          opacity={ opacity / 100 }
          onChangePosition={ onChangePosition }
          file={ file }
        />

        <DropZone
          onDrop={ handleAttachFiles }
        />

        <Controls
          x={ x }
          y={ y }
          opacity={ opacity }
          scale={ scale }
          onChangeOpacity={ updateOpacity }
          onChangePosition={ onChangePosition }
          onChangeScale={ updateScale }
        />

        <PreviewList
          images={ files }
          selected={ file }
          onSelect={ handleSelectImage }
          onDelete={ handleDeleteImage }/>
      </HotKeys>
    </div>
  );
}

export default App;
