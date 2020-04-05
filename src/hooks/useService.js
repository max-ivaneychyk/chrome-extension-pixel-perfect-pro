import StorageService from "../services/StorageService";

export const SERVICES = {
  STORAGE_SERVICE: 'storageService',
};

const instances = {
  [SERVICES.STORAGE_SERVICE]: StorageService,
};

let commonServices = {};

export const getService = (serviceName) => {
  let service = commonServices[serviceName];

  if (!service) {
    commonServices[serviceName] = service = new instances[serviceName]();
  }

  return service;
};

const getServices = listNames => {
  let services = {};

  listNames.forEach(serviceName => {
    services[serviceName] = getService(serviceName);
  });

  return services;
};

/*
const withServices = (Component, injectServices = []) => props => {
  const services = getServices(injectServices);

  return (
    <Component {...services} {...props}/>
  );
};
*/

export const injectServices = (Constructor, listServices) => {
  const services = getServices(listServices);

  Object.assign(Constructor.prototype, services);

  return Constructor
};

export const useService = (serviceName) => {
  return getService(serviceName)
};