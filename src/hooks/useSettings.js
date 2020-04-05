import { useEffect, useState } from "react";
import StorageService from "../services/StorageService";

const storage = new StorageService();

const useSettings = (name, initialValues) => {
  const [ data, _update ] = useState(initialValues);

  useEffect(() => {
    const settings = storage.get(name, initialValues);
    _update(settings);
  }, [ name , initialValues ])

  const update = state => {
    storage.set(name, state)
    _update(state);
  };

  const updateByKey = key => (val) => update({ ...data, [key]: val });
  const merge = newState => update({ ...data, ...newState });

  return [ data, { updateByKey, merge } ];
};

export default useSettings