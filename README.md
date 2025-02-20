# react-tauri-store

## Tauri Store for React apps

This repository provides a simple way to integrate Tauri's local storage (via the [Tauri Store plugin](https://v2.tauri.app/plugin/store/) ) into your React application. It exposes a [React context provider](https://react.dev/reference/react/createContext#provider) and a custom hook so you can easily manage application state that persists on disk.

### Installation

1. Install [tauri-plugin-store](https://github.com/tauri-apps/tauri-plugin-store) and setup `tauri::Builder`

2. Install the frontend package via npm or other package manager

```bash
npm install react-tauri-store
```

### Benefits

- **Simple Integration:** Wrap your React app with the provider to manage persistent state effortlessly.
- **Automatic Synchronization:** No need for extra logic to save or load state; the provider handles it.
- **Familiar React Patterns:** Utilizes React's context and hooks for an idiomatic API.

This setup is designed to make it straightforward for developers using React and Tauri to manage application state that persists locally while reducing boilerplate code.

#### Demo: Auto updating the store file

[demo.webm](https://github.com/user-attachments/assets/39318071-d6e6-45ae-97ac-c0eb5d010801)

### Usage

After installation, wrap your application's root component with the `TauriStoreProvider`. This provider loads your persistent state asynchronously from the specified file and automatically saves any state changes back to store file on user application directory.

```tsx
import { TauriStoreProvider } from "react-tauri-store";

function App() {
  return (
    <TauriStoreProvider filePath="data.json" defaultValues={{ count: 0 }}>
      <YourAppComponents />
    </TauriStoreProvider>
  );
}
```

Within any descendant component, use the `useTauriStore` hook to access and modify the persistent state. For example:

```tsx
import { useTauriStore } from "react-tauri-store";

function App() {
  const { state, set, reset, clear } = useTauriStore<{
    count: number;
    key?: string;
    object?: { k: string };
  }>();

  // Add a new key "key" without modifying the existing state
  const addKey = () => {
    set({ key: "new_value" });
  };

  // Update the existing "key" and add/update the "object" key
  const updateKeys = () => {
    set({ key: "updated_value", object: { k: "v" } });
  };

  return (
    <div>
      <p>Count: {state.count}</p>
      <p>Key: {state.key || "not set"}</p>
      <p>Object: {state.object ? JSON.stringify(state.object) : "not set"}</p>
      <button onClick={addKey}>Add Key</button>
      <button onClick={updateKeys}>Update Key</button>
      <button onClick={reset}>Reset to Default Values</button>
      <button onClick={clear}>Clear All Keys</button>
    </div>
  );
}

export default App;
```

### Key Components

- **TauriStoreProvider**

  - **Purpose:** Wrap your application with this provider to enable state persistence with Tauri.
  - **How It Works:**
    - Asynchronously loads the Tauri store from a specified file path.
    - Merges the on-disk state with provided default values (if any).
    - Listens for state changes and automatically saves updated values back to disk.
  - **Props:**
    - `filePath`: Location of the store file.
    - `defaultValues` (optional): Initial state object.

- **useTauriStore Hook**

  - **Purpose:** Consume and update the persisted state within any descendant component.
  - **How It Works:**
    - Returns the current state, the original dispatch, and two helper functions:
      - **set:** A shorthand setter accepting an object of updates (e.g. `{ key: value }`).
      - **reset:** Resets the state to the initial default values.
      - **clear:** Clear all keys from state.

### How It Works Under the Hood

- The **TauriStoreProvider** uses React's Context and useReducer hook to manage state.
- On mount, it loads the store asynchronously from the specified file path and merges stored values with the provided defaults.
- The provider listens to state changes and writes the updated state back to the store.
- The **useTauriStore** hook returns:
  - `state`: The current store state.
  - `dispatch`: The raw dispatch function.
  - `set`: A shorthand setter that automates the creation of action objects.
  - `reset`: A shorthand setter that resets the state to the initial values provided to the provider.
  - `clear`: A shorthand setter that clear all keys from state.
