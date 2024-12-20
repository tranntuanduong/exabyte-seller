import { useCallback, useEffect, useState } from "react";

const eventEmitter = new EventTarget();

// Hoo
export function useLocalStorage<T>(
  key: string,
  initialValue: T,
  debug?: boolean
) {
  // State to store our value
  // Pass initial state function to useState so logic is only executed once
  const getValueFromStorage = useCallback(() => {
    if (typeof window === "undefined") {
      return initialValue;
    }
    try {
      // Get from local storage by key
      const item = window.localStorage.getItem(key);
      // Parse stored json or if none return initialValue
      return item ? JSON.parse(item) : initialValue;
    } catch (error) {
      // If error also return initialValue
      console.log(error);
      return initialValue;
    }
  }, []);

  const [storedValue, setStoredValue] = useState<T>(getValueFromStorage);
  // Return a wrapped version of useState's setter function that ...
  // ... persists the new value to localStorage.
  const setValue = (value: T | ((val: T) => T)) => {
    try {
      // Allow value to be a function so we have same API as useState
      const valueToStore =
        value instanceof Function ? value(storedValue) : value;
      // Save state
      setStoredValue(valueToStore);
      // Save to local storage
      if (typeof window !== "undefined") {
        window.localStorage.setItem(key, JSON.stringify(valueToStore));
      }
      eventEmitter.dispatchEvent(
        new CustomEvent("StorageChanged", { detail: key })
      );
    } catch (error) {
      // A more advanced implementation would handle the error case
      console.log(error);
    }
  };

  useEffect(() => {
    const triggerGetValueFromStorage = (e: Event) => {
      // @ts-ignore
      if (e.detail === key) {
        const value = getValueFromStorage();
        setStoredValue(value);
      }
    };
    eventEmitter.addEventListener("StorageChanged", triggerGetValueFromStorage);
    return () => {
      eventEmitter.removeEventListener(
        "StorageChanged",
        triggerGetValueFromStorage
      );
    };
  }, []);

  useEffect(() => {
    debug && console.log(storedValue);
  }, [storedValue]);

  return [storedValue, setValue] as const;
}
