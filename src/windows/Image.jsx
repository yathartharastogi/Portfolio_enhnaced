import { useMemo } from "react";
import WindowWrapper from "#hoc/WindowWrapper.jsx";
import WindowControls from "#components/WindowControls.jsx";
import useWindowStore from "#store/window.js";

const ImageContent = ({ windowKey }) => {
  const { windows } = useWindowStore();
  const data = windows?.[windowKey]?.data;

  if (!data) return null;

  return (
    <>
      <div id="window-header" className="relative">
        <WindowControls target={windowKey} />
        <p className="absolute left-1/2 -translate-x-1/2 pointer-events-none">{data.name}</p>
      </div>

      <div className="preview">
        {data.imageUrl && <img src={data.imageUrl} alt={data.name} />}
      </div>
    </>
  );
};

const ImageInstance = ({ windowKey }) => {
  const WrappedImageWindow = useMemo(() => WindowWrapper(ImageContent, windowKey), [windowKey]);
  return <WrappedImageWindow windowKey={windowKey} />;
};

const Image = () => {
  const { windows } = useWindowStore();
  const imageWindowKeys = Object.keys(windows).filter((key) => key === "imgfile" || key.startsWith("imgfile_"));

  return (
    <>
      {imageWindowKeys.map((windowKey) => (
        <ImageInstance key={windowKey} windowKey={windowKey} />
      ))}
    </>
  );
};

export default Image;
