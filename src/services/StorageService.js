const STORAGE_SPLITTER = "::";
const DEFAULT_STORAGE = localStorage;
const STORAGE = {
  LOCAL: "local",
  SESSION: "session"
};

const storageMap = {
  [ STORAGE.LOCAL ]: localStorage,
  [ STORAGE.SESSION ]: sessionStorage
};

const storageList = Object.values(storageMap);

class Observable {

  constructor() {
    this.handlers = {};

    this.outputs = new Proxy({}, {
      set: (obj, prop, value) => {
        const handlers = this.handlers;

        if (handlers[ prop ]) {
          handlers[ prop ].forEach(handler => handler(value));
        }

        return true;
      }
    });
  }

  set(key, val) {
    this.outputs[ key ] = val;
  }

  subscribe = (key, func) => {
    if (!this.handlers[ key ]) {
      this.handlers[ key ] = [];
    }

    this.handlers[ key ].push(func);

    return () => this.unsubscribe(key, func);
  };

  unsubscribe = (key, func) => {
    this.handlers[ key ] = this.handlers[ key ].filter(handler => handler !== func);
  };
}

class StorageService {

  constructor({ store = DEFAULT_STORAGE, version = "_v1" } = {}) {
    this._version = version;
    this.observable = new Observable();
  }

  getStorage(key) {
    const [ keyStorage ] = key.split(STORAGE_SPLITTER);
    return storageMap[ keyStorage ] || DEFAULT_STORAGE;
  }

  _decorateKey(key) {
    return `${key}${this._version}`;
  }

  _objectToString(obj) {
    return JSON.stringify(obj || "");
  }

  _parseString(str) {
    return JSON.parse(str);
  }

  get(key, _default) {
    try {
      const strData = this.getStorage(key).getItem(this._decorateKey(key));
      const data = this._parseString(strData);
      return arguments.length === 1 ? data : data || _default;
    } catch (e) {
      console.warn(e);
      return "";
    }
  }

  set(key, value) {
    this.observable.set(key, value);
    this.getStorage(key).setItem(this._decorateKey(key), this._objectToString(value));
  }

  merge(key, value) {
    const keyName = this._decorateKey(key);
    const oldValue = this.get(key);
    const newValue = Object.assign(oldValue, value);

    this.getStorage(key).setItem(keyName, this._objectToString(newValue));
  }

  remove(key) {
    this.getStorage(key).removeItem(this._decorateKey(key));
  }

  clear() {
    storageList.forEach(storage => {
      this.clearStorage(storage);
    });
  }

  clearStorage(storage) {
    storage.clear();
  }

  clearSession() {
    this.clearStorage(storageMap[ STORAGE.SESSION ]);
  }

  clearByScope(scope) {
    storageList.forEach(storage => {
      this.clearByScopeStorage(scope, storage);
    });
  }

  clearByScopeStorage(scope, storage) {
    const PATTERN = new RegExp(scope);

    Object.keys(storage)
    .filter(key => PATTERN.test(key))
    .map(key => storage.removeItem(key));
  }

  onChange(key, func) {
    return this.observable.subscribe(key, func);
  }
}

export default StorageService;
