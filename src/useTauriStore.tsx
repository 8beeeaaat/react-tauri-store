import { Store } from "@tauri-apps/plugin-store";
import type React from "react";
import {
  createContext,
  useContext,
  useEffect,
  useReducer,
  useState,
} from "react";

type StoreAction<T> =
  | { type: "SET"; key: string; value: T[keyof T] | undefined }
  | { type: "CLEAR" };

function storeReducer<T extends Record<string, unknown>>(
  state: T,
  action: StoreAction<T>,
): T {
  switch (action.type) {
    case "SET":
      return { ...state, [action.key]: action.value };
    case "CLEAR":
      return {} as T;
    default:
      return state;
  }
}

type TauriStoreProviderProps<T extends Record<string, unknown>> = {
  filePath: string;
  defaultValues?: T;
  children: React.ReactNode;
};

const StoreContext = createContext<{
  defaultValues: unknown;
  state: unknown;
  dispatch: React.Dispatch<StoreAction<unknown>>;
} | null>(null);

export function TauriStoreProvider<T extends Record<string, unknown>>({
  filePath,
  defaultValues: _defaultValues,
  children,
}: TauriStoreProviderProps<T>) {
  const defaultValues = _defaultValues || ({} as T);
  const reducer: React.Reducer<T, StoreAction<T>> = storeReducer;
  const [state, dispatch] = useReducer(reducer, defaultValues);
  const [store, setStore] = useState<Store | null>(null);

  // Load store object asynchronously from file
  useEffect(() => {
    (async () => {
      const loadedStore = await Store.load(filePath);
      setStore(loadedStore);
      // Retrieve values from the store on initial load
      for (const key of Object.keys(defaultValues)) {
        const value = await loadedStore.get(key);
        if (value != null) {
          dispatch({ type: "SET", key, value: value as T[keyof T] });
        }
      }
    })();
  }, [filePath, defaultValues]);

  // Save to store when state changes
  useEffect(() => {
    if (!store) return; // Wait until store is loaded

    (async () => {
      if (Object.keys(state).length === 0) {
        await store.clear();
      }

      for (const key in state) {
        await store.set(key, state[key]);
      }
      await store.save();
    })();
  }, [state, store]);

  return (
    <StoreContext.Provider
      value={{ defaultValues: defaultValues, state, dispatch }}
    >
      {children}
    </StoreContext.Provider>
  );
}

export function useTauriStore<T extends Record<string, unknown>>() {
  const context = useContext(StoreContext);
  if (!context) {
    throw new Error("useTauriStore must be used within a TauriStoreProvider");
  }
  const { defaultValues, state, dispatch } = context as {
    defaultValues: T;
    state: T;
    dispatch: React.Dispatch<StoreAction<T>>;
  };

  // The setter shorthand function that accepts an object to update state.
  const set = (updates: Partial<T>) => {
    for (const key in updates) {
      dispatch({ type: "SET", key, value: updates[key] });
    }
  };

  // delete all keys from state
  const clear = () => {
    dispatch({ type: "CLEAR" });
  };

  // reset to defaultValues
  const reset = () => {
    dispatch({ type: "CLEAR" });
    set(defaultValues);
  };

  return {
    state,
    clear,
    dispatch,
    set,
    reset,
  };
}
