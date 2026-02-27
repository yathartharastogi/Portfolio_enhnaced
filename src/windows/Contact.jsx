import WindowWrapper from "#hoc/WindowWrapper.jsx";
import { socials } from "#constants/index.js";
import { WindowControls } from "#components/index.js";

const Contact = () => {
  return (
    <>
      <div id="window-header">
        <WindowControls target="contact" />
        <h1>Contact Me</h1>
      </div>
      <div className="p-5 space-y-5">
        <img src="/images/moi.jpg" alt="Yathartha" className="w-20 rounded-full" />
        <h3>Let&apos;s Connect</h3>
        <p>Got an idea? A bug to squash? Or just want to talk tech? I&apos;m in.</p>
        <ul className="space-y-2">
          {socials.map(({ id, bg, link, icon, text }) => (
            <li key={id} style={{ backgroundColor: bg }}>
              <a href={link} title={text} target="_blank" rel="noopener noreferrer" className="flex items-center gap-2 p-2">
                <img src={icon} alt={text} className="size-5" />
                <p>{text}</p>
              </a>
            </li>
          ))}
        </ul>
      </div>
    </>
  );
};

const ContactWindow = WindowWrapper(Contact, "contact");
export default ContactWindow;
