import { Store } from "@tauri-apps/plugin-store";
import { act, renderHook, waitFor } from "@testing-library/react";
import type React from "react";
import { beforeAll, describe, expect, it } from "vitest";
import { TauriStoreProvider, useTauriStore } from "./useTauriStore.js";

// Mock Store.load to return a dummy store object
beforeAll(() => {
  Store.load = async (_filePath: string) => {
    return {
      async get(_key: string) {
        return null;
      },
      async set(_key: string, _value: unknown) {},
      async save() {},
      async has(_key: string) {
        return false;
      },
      async delete(_key: string) {},
      async clear() {},
      async reset() {},
    } as unknown as Store;
  };
});

describe("useTauriStore hook", () => {
  const wrapper: React.FC<{ children: React.ReactNode }> = ({ children }) => (
    <TauriStoreProvider filePath="dummy.json" defaultValues={{ count: 1 }}>
      {children}
    </TauriStoreProvider>
  );

  it("should return default state from provider", async () => {
    const { result } = renderHook(() => useTauriStore(), { wrapper });
    // Wait until the store is loaded
    await waitFor(() => {
      expect(result.current.state).toBeDefined();
    });
    expect(result.current.state).toEqual({ count: 1 });
    expect(typeof result.current.dispatch).toBe("function");
  });

  it("should update state when dispatch is called", async () => {
    const { result } = renderHook(() => useTauriStore(), { wrapper });
    // Wait until the store is loaded
    await waitFor(() => {
      expect(result.current.state).toBeDefined();
    });
    act(() => {
      result.current.dispatch({ type: "SET", key: "count", value: 5 });
    });
    expect(result.current.state).toEqual({ count: 5 });
  });

  it("should update state when set is shorthand setter called with object", async () => {
    const { result } = renderHook(() => useTauriStore(), { wrapper });

    await waitFor(() => {
      expect(result.current.state).toBeDefined();
    });
    act(() => {
      result.current.set({ key: "value" });
    });
    expect(result.current.state).toEqual({ count: 1, key: "value" });

    act(() => {
      result.current.set({ object: { k: "v" }, key: "updated" });
    });
    expect(result.current.state).toEqual({
      count: 1,
      object: { k: "v" },
      key: "updated",
    });
  });

  it("should reset state to default values", async () => {
    const { result } = renderHook(() => useTauriStore(), { wrapper });

    await waitFor(() => {
      expect(result.current.state).toBeDefined();
    });
    act(() => {
      result.current.set({ count: 2, object: { k: "v" } });
      result.current.reset();
    });
    expect(result.current.state).toEqual({ count: 1 });
  });

  it("should clear all keys from state", async () => {
    const { result } = renderHook(() => useTauriStore(), { wrapper });

    await waitFor(() => {
      expect(result.current.state).toBeDefined();
    });
    expect(result.current.state).toEqual({ count: 1 });
    act(() => {
      result.current.clear();
    });
    expect(result.current.state).toEqual({});
  });
});
