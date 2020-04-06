


export const joinClasses = (...classes) => {
  return classes.join(' ')
}

export const toNumber = (val) => {
  return parseInt(val || 0, 10)
}

export const toDecimal = (val) => {
  return parseFloat(val || 0)
}

export const noop = () => null;

export const objectEmpty = obj => !Object.keys(obj).length;