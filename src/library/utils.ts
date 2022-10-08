export const omitObject = <T>(object: T, keys: keyof T | (keyof T)[]) => {
  if (Array.isArray(keys)) {
    const newObj: any = {};
    for (const field in object) {
      if (keys.includes(field)) continue;

      newObj[field] = object?.[field] || null;
    }

    return newObj;
  }

  delete object[keys];
  return object;
};
