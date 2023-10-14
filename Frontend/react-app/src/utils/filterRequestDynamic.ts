export const filterObject = (obj: any) => {
  const result: any = {}
  for (const key in obj) {
    if (Object.prototype.hasOwnProperty.call(obj, key)) {
      const value = obj[key]
      if (filterFunction(key, value)) {
        result[key] = value
      }
    }
  }
  return result
}
const filterFunction = (key: any, value: any) => value !== ''
