import { useMemo } from "react";

const useRandom = <T = any>(array: T[], dependency?: any) => {
  return useMemo(() => {
    const randomIndex = Math.floor(Math.random() * array.length);

    return array[randomIndex];
  }, [array, dependency]);
};

export default useRandom;
