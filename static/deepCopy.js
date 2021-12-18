export function deepCopyFunction(obj) {
  if(typeof obj !== 'object' || obj === null) {
      return obj;
  }

  // if(obj instanceof Date) {
  //     return new Date(obj.getTime());
  // }

  if(obj instanceof Array) {
      return obj.reduce((arr, item, i) => {
          arr[i] = deepCopyFunction(item);
          return arr;
      }, []);
  }

  if(obj instanceof Object) {
      return Object.keys(obj).reduce((newObj, key) => {
          newObj[key] = deepCopyFunction(obj[key]);
          return newObj;
      }, {})
  }
}

// export const deepCopyFunction = inObject => {
//     let outObject, value, key;
  
//     if (typeof inObject !== "object" || inObject === null) {
//       return inObject;
//     }
  
//     outObject = Array();
  
//     for (key in inObject) {
//       value = inObject[key];  
//       outObject[key] = deepCopyFunction(value);
//     }
  
//     return outObject;
//   }