export const validateName = (name: string, num: number) => {
  if (!name) return name;
  if (name.length > num) {
    return name.slice(0, num) + "..";
  }
  return name;
};
