export function env(key: string): string {
    // function to access enviroment variables
    const value = process.env[key];
    if (value === undefined) {
      throw `${key} is undefined`;
    }
    return value;
  }