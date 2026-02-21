import useWindowStore from "#store/window.js";

const WindowControls = ({ target }) => {
    const { closeWindow, minimizeWindow, toggleMaximizeWindow } = useWindowStore();

    return (
        <div id="window-controls">
            <button type="button" aria-label="Close window" className="close" onClick={(e) => { e.stopPropagation(); closeWindow(target); }} />
            <button type="button" aria-label="Minimize window" className="minimize" onClick={(e) => { e.stopPropagation(); minimizeWindow(target); }} />
            <button type="button" aria-label="Maximize window" className="maximize" onClick={(e) => { e.stopPropagation(); toggleMaximizeWindow(target); }} />

        </div>
    )
}
export default WindowControls
