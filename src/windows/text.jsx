import { useMemo } from "react";
import WindowWrapper from "#hoc/WindowWrapper.jsx";
import WindowControls from "#components/WindowControls.jsx";
import useWindowStore from "#store/window.js";

const TextContent = ({ windowKey }) => {
  const { windows } = useWindowStore();
  const data = windows?.[windowKey]?.data;

  if (!data) return null;

  return (
    <>
      <div id="window-header" className="relative">
        <WindowControls target={windowKey} />
        <h2 className="absolute left-1/2 -translate-x-1/2 pointer-events-none">{data.name}</h2>
      </div>

      <div className="p-5 space-y-4 bg-white">
        {data.image && <img src={data.image} alt={data.name} className="w-full rounded-md object-cover" />}
        {data.subtitle && <p className="text-sm font-semibold text-gray-800">{data.subtitle}</p>}
        {Array.isArray(data.description) &&
          data.description.map((paragraph, index) => (
            <p key={index} className="text-sm text-gray-700 leading-relaxed">
              {paragraph}
            </p>
          ))}
      </div>
    </>
  );
};

const TextInstance = ({ windowKey }) => {
  const WrappedTextWindow = useMemo(() => WindowWrapper(TextContent, windowKey), [windowKey]);
  return <WrappedTextWindow windowKey={windowKey} />;
};

const Text = () => {
  const { windows } = useWindowStore();
  const txtWindowKeys = Object.keys(windows).filter((key) => key === "txtfile" || key.startsWith("txtfile_"));

  return (
    <>
      {txtWindowKeys.map((windowKey) => (
        <TextInstance key={windowKey} windowKey={windowKey} />
      ))}
    </>
  );
};

export default Text;
