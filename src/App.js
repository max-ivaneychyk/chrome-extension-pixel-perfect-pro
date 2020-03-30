import React, { useState, useEffect } from 'react';
import './App.scss';
import Image from "./components/Image";
import { HotKeys } from "react-hotkeys";
import Controls from "./components/Controls";
import * as Store from './store'
import PreviewList from "./components/PreviewList";
import StorageService from "./services/StorageService";

const keyMap = {
  TO_LEFT: [ "left", 'a' ],
  TO_RIGHT: [ "right", 'd' ],
  TO_UP: [ "up", 'w' ],
  TO_DOWN: [ "down", 's' ],
};

const SETTINGS = {
  x: 0,
  y: 0,
  scale: 1,
  opacity: 100,
  inversion: 0,
  center: false
}

class ImageSource {
  constructor(file, name) {
    this.file = file;
    this.name = name;
    this.href = ImageSource.getBlobLink(file)
  }

  static getBlobLink = blob => {
    return URL.createObjectURL(blob)
  }

  static createName = (filename) => {
    return `date=${ Date.now() }&name=${ filename }`
  }
}

const useLayerSettings = (name) => {
  const [ data, _update ] = useState(SETTINGS);

  useEffect(() => {
    const settings = new StorageService().get(name, SETTINGS);
    _update(settings);
  }, [ name ])

  const update = state => {
    new StorageService().set(name, state)
    _update(state);
  };

  const updateByKey = key => (val) => update({ ...data, [key]: val });
  const merge = newState => update({ ...data, ...newState });

  return [ data, { updateByKey, merge } ];

};

function App() {
  // Images
  const [ files, updateFiles ] = useState([]);
  const [ file, updateFile ] = useState(null);
  // Options
  const [ lock, updateLock ] = useState(false);
  const [ visible, onChangeVisibility ] = useState(true);
  const [ settings, updateSettings ] = useLayerSettings(file ? file.name : '');
  const { x, y, opacity, scale, center, inversion } = settings;

  const { updateByKey, merge } = updateSettings;
  const updateScale = updateByKey('scale');
  const updateOpacity = updateByKey('opacity');
  const updateX = updateByKey('x');
  const updateY = updateByKey('y');
  const updateAlignX = updateByKey('center');
  const onChangeInversion = updateByKey('inversion');

  const handleAttachFiles = newFiles => {
    const images = newFiles.map(file => new ImageSource(
      file, ImageSource.createName(file.name)
      )
    )

    images.forEach(({ file, name }) => Store.set(name, file));

    updateFiles([
      ...files,
      ...images
    ]);

    if (!file) {
      updateFile(images[0])
    }
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

  return (
    <div className="App-Extension">
      <HotKeys keyMap={ keyMap } handlers={ handlers } allowChanges>

        <Image
          x={ x }
          y={ y }
          inversion={ inversion }
          visible={ visible }
          scale={ scale }
          lock={ lock }
          opacity={ opacity / 100 }
          onChangePosition={ onChangePosition }
          file={ file }
          center={ center }
        />

        <Controls
          x={ x }
          y={ y }
          opacity={ opacity }
          scale={ scale }
          lock={ lock }
          center={ center }
          visible={ visible }
          inversion={ inversion }
          onChangeInversion={ onChangeInversion }
          onAlignCenter={ updateAlignX }
          onLock={ updateLock }
          onChangeOpacity={ updateOpacity }
          onChangePosition={ onChangePosition }
          onChangeScale={ updateScale }
          onChangeVisibility={ onChangeVisibility }
        />

        <PreviewList
          images={ files }
          selected={ file }
          onSelect={ handleSelectImage }
          onDrop={ handleAttachFiles }
          onDelete={ handleDeleteImage }/>
      </HotKeys>
    </div>
  );
}

export default App;
