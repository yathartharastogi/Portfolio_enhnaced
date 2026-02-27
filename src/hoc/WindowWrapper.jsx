import { useEffect, useRef } from "react";
import gsap from "gsap";
import { Draggable } from "gsap/Draggable";
import { useGSAP } from "@gsap/react";
import useWindowStore from "#store/window.js";

gsap.registerPlugin(Draggable);

const WindowWrapper = (Component, windowKey) => {
  const Wrapped = (props) => {
    const { focusWindow, setWindowSize, windows } = useWindowStore();
    const windowState = windows?.[windowKey];
    const ref = useRef(null);
    const resizeStartRef = useRef(null);
    const isMinimized = !!windowState?.isMinimized;
    const isMaximized = !!windowState?.isMaximized;
    const topZIndex = Math.max(
      ...Object.values(windows ?? {})
        .filter((win) => win?.isOpen && !win?.isMinimized)
        .map((win) => win?.zIndex ?? 0),
      0,
    );
    const isActiveWindow = !!windowState?.isOpen && !isMinimized && windowState?.zIndex === topZIndex;

    useEffect(() => {
      const handleMouseMove = (event) => {
        const start = resizeStartRef.current;
        if (!start) return;

        const nextWidth = Math.max(360, start.width + (event.clientX - start.x));
        const nextHeight = Math.max(220, start.height + (event.clientY - start.y));
        setWindowSize(windowKey, {
          width: `${nextWidth}px`,
          height: `${nextHeight}px`,
        });
      };

      const handleMouseUp = () => {
        resizeStartRef.current = null;
      };

      window.addEventListener("mousemove", handleMouseMove);
      window.addEventListener("mouseup", handleMouseUp);
      return () => {
        window.removeEventListener("mousemove", handleMouseMove);
        window.removeEventListener("mouseup", handleMouseUp);
      };
    }, [setWindowSize]);

    const onResizeMouseDown = (event) => {
      if (isMaximized || !ref.current) return;
      event.preventDefault();
      event.stopPropagation();
      focusWindow(windowKey);

      resizeStartRef.current = {
        x: event.clientX,
        y: event.clientY,
        width: ref.current.offsetWidth,
        height: ref.current.offsetHeight,
      };
    };

    useGSAP(
      () => {
        if (!ref.current || !windowState?.isOpen || isMinimized || isMaximized) return;

        const handle = ref.current.querySelector("#window-header") || ref.current;
        const [instance] = Draggable.create(ref.current, {
          type: "x,y",
          handle,
          onPress: () => focusWindow(windowKey),
        });

        return () => instance.kill();
      },
      { dependencies: [windowState?.isOpen, isMinimized, isMaximized, windowKey], scope: ref },
    );

    if (!windowState?.isOpen || isMinimized) return null;

    return (
      <section
        id={windowKey}
        ref={ref}
        data-window-active={isActiveWindow ? "true" : "false"}
        style={{
          zIndex: windowState.zIndex,
          ...(!isMaximized && windowState?.size ? windowState.size : {}),
          ...(isMaximized
            ? {
                top: 0,
                left: 0,
                right: 0,
                bottom: 0,
                width: "100vw",
                height: "100dvh",
                maxWidth: "100vw",
                maxHeight: "100dvh",
                minWidth: 0,
                minHeight: 0,
                borderRadius: 0,
                transform: "none",
              }
            : {}),
        }}
        className="absolute"
        onMouseDown={() => focusWindow(windowKey)}
      >
        <Component {...props} />
        {!isMaximized && (
          <button
            type="button"
            aria-label="Resize window"
            className="absolute bottom-0 right-0 h-4 w-4 cursor-nwse-resize"
            onMouseDown={onResizeMouseDown}
          />
        )}
      </section>
    );
  };

  Wrapped.displayName = `WindowWrapper(${Component.displayName || Component.name || "Component"})`;
  return Wrapped;
};

export default WindowWrapper;
