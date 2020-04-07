import { useCallback, useEffect, useState } from "react";
import { SERVICES, useService } from "./useService";

const useSettings = (name, initialValues) => {
  const storage = useService(SERVICES.STORAGE_SERVICE);
  const toJSON = useCallback(obj => storage.toJSON(obj), [ storage ]);
  const parse = useCallback(json => storage.parse(json), [ storage ]);
  const [ json, update ] = useState(toJSON(initialValues));

  useEffect(() => {
    const settings = storage.get(name, initialValues);

    update(toJSON(settings));

    return storage.onChange(name, data => update(toJSON(data)))
  }, [ name, initialValues, storage, toJSON ])

  const updateState = useCallback(state => {
    storage.set(name, state)
    update(toJSON(state));
  }, [ storage, toJSON, name ]);

  const merge = useCallback(newState =>
      updateState({ ...parse(json), ...newState }),
    [ parse, json, updateState ]
  );

  const updateByKey = useCallback(key =>
      val => merge({ [key]: val }),
    [ merge ]);

  return [ parse(json), { updateByKey, merge, parseJSON: parse, toJSON } ];
};

export default useSettings