import { create } from "zustand";
import { immer } from "zustand/middleware/immer";
import { INITIAL_Z_INDEX, WINDOW_CONFIG } from "#constants/index.js";

const useWindowStore = create(
  immer((set) => ({
    windows: WINDOW_CONFIG,
    nextZIndex: INITIAL_Z_INDEX + 1,

    openWindow: (windowKey, data = null) =>
      set((state) => {
        const isMultiInstanceWindow = (key) => key === "txtfile" || key === "imgfile";
        if (isMultiInstanceWindow(windowKey) && data) {
          const existingWindowKey = Object.keys(state.windows).find((key) => {
            const isSameType = key === windowKey || key.startsWith(`${windowKey}_`);
            return isSameType && state.windows[key]?.data?._windowId === data._windowId;
          });

          if (existingWindowKey) {
            const existingWindow = state.windows[existingWindowKey];
            existingWindow.isOpen = true;
            existingWindow.isMinimized = false;
            existingWindow.zIndex = state.nextZIndex;
            state.nextZIndex++;
            return;
          }

          const baseWindow = state.windows[windowKey];
          if (baseWindow?.isOpen) {
            const instanceKey = `${windowKey}_${Date.now()}_${Math.floor(Math.random() * 1000)}`;
            state.windows[instanceKey] = {
              ...WINDOW_CONFIG[windowKey],
              isOpen: true,
              isMinimized: false,
              isMaximized: false,
              zIndex: state.nextZIndex,
              data,
            };
            state.nextZIndex++;
            return;
          }
        }

        const win = state.windows[windowKey];
        if (!win) return;
        const restoringFromMinimize = win.isOpen && win.isMinimized;
        win.isOpen = true;
        win.isMinimized = false;
        if (!restoringFromMinimize) {
          win.isMaximized = false;
        }
        win.zIndex = state.nextZIndex;
        win.data = data ?? win.data;
        state.nextZIndex++;
      }),
    closeWindow: (windowKey) =>
      set((state) => {
        const win = state.windows[windowKey];
        if (!win) return;

        if (windowKey.startsWith("txtfile_") || windowKey.startsWith("imgfile_")) {
          delete state.windows[windowKey];
          return;
        }

        win.isOpen = false;
        win.isMinimized = false;
        win.isMaximized = false;
        win.zIndex = INITIAL_Z_INDEX;
        win.size = null;
        win.data = null;
      }),
    minimizeWindow: (windowKey) =>
      set((state) => {
        const win = state.windows[windowKey];
        if (!win) return;
        win.isMinimized = true;
      }),
    toggleMaximizeWindow: (windowKey) =>
      set((state) => {
        const win = state.windows[windowKey];
        if (!win) return;
        win.isMaximized = !win.isMaximized;
        win.isMinimized = false;
        win.zIndex = state.nextZIndex++;
      }),
    focusWindow: (windowKey) =>
      set((state) => {
        const win = state.windows[windowKey];
        if (!win) return;
        win.zIndex = state.nextZIndex++;
      }),
    setWindowSize: (windowKey, size) =>
      set((state) => {
        const win = state.windows[windowKey];
        if (!win) return;
        win.size = size;
      }),
  })),
);

export default useWindowStore;
