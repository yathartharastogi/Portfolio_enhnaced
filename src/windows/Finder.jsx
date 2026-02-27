import { WindowControls } from "#components";
import WindowWrapper from "#hoc/WindowWrapper.jsx";
import { locations } from "#constants/index.js";
import useLocationStore from "#store/location.js";
import useWindowStore from "#store/window.js";
import { SearchIcon } from "lucide-react";
import clsx from "clsx";

const Finder = () => {
  const { activeLocation, setActiveLocation } = useLocationStore();
  const { openWindow } = useWindowStore();
  const locationItems = activeLocation?.children ?? [];
  const openItem = (item) => {
    if (item.fileType === "txt") {
      const txtWindowData = {
        ...item,
        _windowId: `${activeLocation?.id ?? "root"}-${item.id}-${item.name}`,
      };
      return openWindow("txtfile", txtWindowData);
    }
    if (item.fileType === "img") {
      const imgWindowData = {
        ...item,
        _windowId: `${activeLocation?.id ?? "root"}-${item.id}-${item.name}`,
      };
      return openWindow("imgfile", imgWindowData);
    }
    if (item.fileType === "pdf") return openWindow("resume");
    if (item.kind === "folder") return setActiveLocation(item);
    if (["fig", "url"].includes(item.fileType) && item.href) return window.open(item.href, "_blank");
  };
  return (
    <>
      <div id="window-header">
        <WindowControls target="finder" />
        <SearchIcon className="icon" />
      </div>

      <div className="bg-white flex h-full">
        <div className="sidebar">
          <div>
            <h3>Favorites</h3>
            <ul>
              {Object.values(locations).map((item) => (
                <li
                  key={item.id}
                  onClick={() => setActiveLocation(item)}
                  className={clsx(item.id === activeLocation?.id ? "active" : "not-active")}
                >
                  <img src={item.icon} className="w-4" alt={item.name} />
                  <p className="text-sm font-medium truncate">{item.name}</p>
                </li>
              ))}
            </ul>
          </div>
          <div>
            <h3>Work</h3>
            <ul>
              {locations.work.children.map((item) => (
                <li
                  key={item.id}
                  onClick={() => setActiveLocation(item)}
                  className={clsx(item.id === activeLocation?.id ? "active" : "not-active")}
                >
                  <img src={item.icon} className="w-4" alt={item.name} />
                  <p className="text-sm font-medium truncate">{item.name}</p>
                </li>
              ))}
            </ul>
          </div>
        </div>

        <div className="content">
          <ul>
            {locationItems.map((item) => (
              <li key={`${activeLocation?.id}-${item.id}`} className={item.position ?? ""} onClick={() => openItem(item)}>
                <img src={item.icon} alt={item.name} />
                <p>{item.name}</p>
              </li>
            ))}
          </ul>
        </div>
      </div>
    </>
  );
};

const FinderWindow = WindowWrapper(Finder, "finder");

export default FinderWindow;
