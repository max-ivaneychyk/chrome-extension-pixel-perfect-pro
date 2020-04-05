import { useEffect, useState } from "react";
import { SERVICES, useService } from "./useService";

const useSettings = (name, initialValues) => {
  const storage = useService(SERVICES.STORAGE_SERVICE)
  const [ data, _update ] = useState(initialValues);

  useEffect(() => {
    const settings = storage.get(name, initialValues);

    _update(settings);

    return storage.onChange(name, _update)
  }, [ name , initialValues, storage ])

  const update = state => {
    storage.set(name, state)
    _update(state);
  };

  const updateByKey = key => (val) => update({ ...data, [key]: val });
  const merge = newState => update({ ...data, ...newState });

  return [ data, { updateByKey, merge } ];
};

export default useSettings