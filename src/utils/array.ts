export const shuffleArray = (arr: any[]) => {
  for (let i = arr.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [arr[i], arr[j]] = [arr[j], arr[i]];
  }
  return arr;
};

export const swapElement = (
  arr: any[],
  index1: number,
  index2: number
) => {
  const newArray = [...arr];
  [newArray[index1], newArray[index2]] = [newArray[index2], newArray[index1]];

  return newArray;
};
