import { pick } from "lodash";

export const customPick = <T = any>(data: T, keys: Array<keyof T>): Partial<T> => {
	return pick(data, keys);
};
