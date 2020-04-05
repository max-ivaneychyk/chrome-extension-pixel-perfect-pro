import React, { useState, useEffect } from 'react';
import './App.scss';
import Image from "./components/Image";
import { HotKeys } from "react-hotkeys";
import Controls from "./components/Controls";
import * as Database from './store'
import PreviewList from "./components/PreviewList";
import { APP_KEY, EXTENSION_SETTINGS } from "./const/app";
import useSettings from "./hooks/useSettings";
import { SETTINGS } from "./const/layer";
import { SERVICES, useService } from "./hooks/useService";

const keyMap = {
  TO_LEFT: [ "left", 'a' ],
  TO_RIGHT: [ "right", 'd' ],
  TO_UP: [ "up", 'w' ],
  TO_DOWN: [ "down", 's' ],
};

const KEY_LAST_SELECTED = 'last_selected_layer';

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

function App() {
  const storage = useService(SERVICES.STORAGE_SERVICE);
  // Images
  const [ files, updateFiles ] = useState([]);
  const [ file, _updateFile ] = useState(null);
  // Options
  const [ settings, updateSettings ] = useSettings(file ? file.name : '', SETTINGS);
  const [ { visible, lock }, updateAppSettings ] = useSettings(APP_KEY, EXTENSION_SETTINGS);
  const { x, y, opacity, scale, center, inversion, alignVertical } = settings;

  const updateFile = state => {
    _updateFile(state);
    storage.set(KEY_LAST_SELECTED, state ? state.name : '')
  };

  const updateLock = updateAppSettings.updateByKey('lock');
  const onChangeVisibility = updateAppSettings.updateByKey('visible');

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

    images.forEach(({ file, name }) => Database.set(name, file));

    updateFiles([
      ...files,
      ...images
    ]);

    if (!file) {
      updateFile(images[0])
    }
  };

  useEffect(() => {

    Database
    .getAll()
    .then(files => {
      const images = files.map(([ key, file ]) => new ImageSource(file, key))
      const prevKeyImg = storage.get(KEY_LAST_SELECTED, '');
      const [ activeImage = images[0] ] = images.filter(img => img.name === prevKeyImg)

      updateFiles(images);
      _updateFile(activeImage || null)
    });
  }, [ storage ]);


  const handleDeleteImage = name => {
    const newFiles = files.filter(({ name: id }) => id !== name);

    Database.remove(name);
    storage.remove(name)
    updateFiles(newFiles);

    if (file && file.name === name) {
      updateFile(newFiles[0] || null)
    }
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
      <HotKeys
        keyMap={ keyMap }
        handlers={ handlers }
        allowChanges>

        {
          !!files.length && <>
            <Image
              x={ x }
              y={ y }
              inversion={ inversion }
              visible={ visible }
              scale={ scale }
              lock={ lock }
              alignVertical={ alignVertical }
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
              alignVertical={ alignVertical }
              inversion={ inversion }
              onChangeInversion={ onChangeInversion }
              onAlignCenter={ updateAlignX }
              onLock={ updateLock }
              onChangeOpacity={ updateOpacity }
              onChangePosition={ onChangePosition }
              onChangeScale={ updateScale }
              onChangeVisibility={ onChangeVisibility }
              onAlignVerticalCenter={ updateByKey('alignVertical') }
            />
          </>
        }

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
