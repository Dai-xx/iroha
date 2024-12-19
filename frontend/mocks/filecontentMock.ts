export const filecontentMock = Array.from({ length: 2 }, (_, index) => ({
  content: `const data${index} = ${index};`,
  filename: `file${index}`,
}));
