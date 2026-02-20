import {useRef} from "react";
import gsap from "gsap";
import {useGSAP} from "@gsap/react";

const FONT_WEIGHTS = {
    subtitle: {min: 100, max:400, default: 100},
    title: {min: 400, max: 900, default: 400},
}

const renderText = (className, baseWeight=400, text) => {
    return [...text].map((char, i)=>
    <span key={i} className={className} style={{fontVariationSettings: `"wght" ${baseWeight}`}}>
        {char === " " ? "\u00A0" : char}
    </span>)
}

const setupTextHover = (container, type) => {
    if(!container) return () => {};
    const letters = container.querySelectorAll('span');
    const{min, max, default: base} = FONT_WEIGHTS[type];

    const animateLetter = (letter, weight, duration =0.25) => {
        return gsap.to(letter, {duration, ease:"power2.out", fontVariationSettings: `"wght" ${weight}`
        });
    };

  const handleMouseMove = (e) => {
      const {left: containerLeft} = container.getBoundingClientRect();
      const mouseX = e.clientX - containerLeft;

      letters.forEach((letter) => {
          const {left: letterLeft, width: w}= letter.getBoundingClientRect();
          const letterCenter = (letterLeft - containerLeft) + (w / 2);
          const distance = Math.abs(mouseX - letterCenter);
          const intensity = Math.exp(-(distance**2)/10000);

          animateLetter(letter, min + (max - min) * intensity);
      });
  };
  const handleMouseLeave = () => {
      letters.forEach((letter) => animateLetter(letter, base, 0.3));
  };

  container.addEventListener("mousemove", handleMouseMove);
  container.addEventListener("mouseleave", handleMouseLeave);

  return () => {
      container.removeEventListener("mousemove", handleMouseMove);
      container.removeEventListener("mouseleave", handleMouseLeave);
  };

};

const Welcome = () => {
    const titleRef = useRef(null);
    const subtitleRef = useRef(null);

    useGSAP(()=> {
        const titleCleanup = setupTextHover(titleRef.current, "title");
        const subtitleCleanup = setupTextHover(subtitleRef.current, "subtitle");
        return () => {
            titleCleanup();
            subtitleCleanup();
        };
    }, []);

    return (
        <section id="welcome">
            <p ref={subtitleRef}>
                {renderText(
                    "text-3xl font-georama",
                    100,
                    "Hey, I'm Yathartha! Welcome to my"
                )}
            </p>
            <h1 ref={titleRef} className="mt-7">
                {renderText("text-9xl italic font-georama",400,"Portfolio")}
            </h1>
            <div className="small-screen">
                <p>This portfolio is designed for dekstop/tablet screens only.</p>
            </div>
        </section>
    )
}
export default Welcome
