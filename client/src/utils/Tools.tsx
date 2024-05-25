const validRegex = (validate: string, pattern: RegExp): boolean => {
  const isValidRegex = pattern.test(validate);
  return isValidRegex;
};

declare global {
  interface String {
    toTitleCase(): string;
  }
  interface Array<T> {
    equals(array: T[]): boolean;
  }
}

String.prototype.toTitleCase = function (this: string): string {
  return this.toLowerCase()
    .split(" ")
    .map((word) => word.charAt(0).toUpperCase() + word.slice(1))
    .join(" ");
};

// Extend Array prototype to add a custom equals method
declare global {
  interface Array<T> {
    equals(array: T[]): boolean;
  }
}

Array.prototype.equals = function <T>(array: T[]): boolean {
  // If both arrays are empty, they are considered equal
  if (this.length === 0 && array.length === 0) return true;

  // If arrays have different lengths, they are not equal
  if (this.length !== array.length) return false;

  // Otherwise, compare the arrays element by element
  for (let i = 0; i < this.length; i++) {
    if (!objectsEqual(this[i], array[i])) {
      return false;
    }
  }
  return true;
};

function objectsEqual(obj1: any, obj2: any): boolean {
  // Convert objects to JSON strings and compare them
  return JSON.stringify(obj1) === JSON.stringify(obj2);
}

export { validRegex };
