import CustomFooter from "@/components/footer";
import React, { CSSProperties, useRef } from "react";
import LandingStat from "./landingStat";
import LoginLanding from "./loginLanding";
import LandingReview from "./landingReview";
import InitialLanding from "./initialLanding";

const LandingPage = () => {
  const sectionStyle: CSSProperties = {
    height: "100vh",
  };

  const containerStyle: CSSProperties = {
    scrollSnapType: "y mandatory",
    overflowY: "scroll",
    height: "100vh",
    width: "100vw",
  };

  const sectionSnapStyle: CSSProperties = {
    ...sectionStyle,
    scrollSnapAlign: "start",
  };

  const landingStatRef = useRef<HTMLElement>(null);

  const scrollToLandingStat = () => {
    if (landingStatRef.current) {
      landingStatRef.current.scrollIntoView({ behavior: "smooth" });
    }
  };

  return (
    <div style={containerStyle}>
      {/* <section style={sectionSnapStyle}>
        <LoginLanding />
      </section> */}
      <section style={sectionSnapStyle}>
        <InitialLanding scrollToLandingStat={scrollToLandingStat} />
      </section>
      <section style={sectionSnapStyle} ref={landingStatRef}>
        <LandingStat />
      </section>
      <section style={sectionSnapStyle}>
        <LandingReview />
      </section>
    </div>
  );
};

export default LandingPage;
