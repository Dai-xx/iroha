export const filedataMock = Array.from({ length: 100 }, (_, index) => ({
  createdAt: `2024-11-${index}`,
  project: `project-${index}`,
  fileList: [
    { filename: `main${index}.cpp` },
    { filename: `String${index}.cpp` },
    { filename: `String${index}.h` },
  ],
}));
