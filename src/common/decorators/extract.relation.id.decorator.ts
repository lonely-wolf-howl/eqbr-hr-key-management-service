import 'reflect-metadata';

export function ExtractRelationIds(...relations: string[]) {
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
          relations.forEach((relation) => {
            if (item[relation] && typeof item[relation] === 'object') {
              const firstKey = Object.keys(item[relation])[0];
              item[firstKey] = item[relation][firstKey];
              if (firstKey !== relation) {
                delete item[relation];
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
