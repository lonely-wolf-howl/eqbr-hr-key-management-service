import 'reflect-metadata';

export function Flatten(...properties: string[]) {
  return function (
    target: any,
    propertyName: string,
    descriptor: PropertyDescriptor,
  ) {
    const method = descriptor.value;

    descriptor.value = async function (...args: any[]) {
      const result = await method.apply(this, args);

      const processResult = (item: any) => {
        if (item) {
          properties.forEach((property) => {
            if (item[property]) {
              if (Array.isArray(item[property])) {
                item[property] = item[property].map((nestedItem: any) => ({
                  ...nestedItem,
                }));
              } else {
                Object.keys(item[property]).forEach((key) => {
                  item[key] = item[property][key];
                });
                if (typeof item[property] === 'object') delete item[property];
              }
            }
          });
        }
      };

      if (Array.isArray(result)) {
        result.forEach(processResult);
      } else {
        processResult(result);
      }

      return result;
    };

    return descriptor;
  };
}
