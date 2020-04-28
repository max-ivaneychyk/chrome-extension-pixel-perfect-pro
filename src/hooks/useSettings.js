import { useCallback, useEffect, useState } from "react";
import { SERVICES, useService } from "./useService";

export const useStorageValue = (storageKey, key, initialValue) => {
  const storage = useService(SERVICES.STORAGE_SERVICE);
  const [ value, updateStore ] = useState( storage.getByKey(storageKey, key, initialValue) );

  const update = useCallback(newValue => {
    storage.setByKey(storageKey, key, newValue);
  }, [ storage, storageKey, key ]);

  useEffect(() => {
    return storage.onChangeByKey(storageKey, key, updateStore);
  }, [ storage, storageKey, key ])

  return [ value, update ];
}

const useSettings = (name, initialValues) => {
  const storage = useService(SERVICES.STORAGE_SERVICE);
  const [ data, update ] = useState(storage.get(name, initialValues));

  useEffect(() => {
    update(storage.get(name, initialValues))
    return storage.onChange(name, update)
  }, [ name, storage, initialValues ])

  const updateState = useCallback(state => {
    storage.set(name, state)
  }, [ storage, name ]);

  const merge = useCallback(newState =>
      updateState({ ...data, ...newState }),
    [ data, updateState ]
  );

  const updateByKey = useCallback(key =>
      val => merge({ [key]: val }),
    [ merge ]);

  return [ data, { updateByKey, merge } ];
};

export default useSettings