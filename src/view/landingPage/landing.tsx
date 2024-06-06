import React, { CSSProperties, useRef, useState, useEffect } from "react";
import LandingStat from "./landingStat";
import LandingReview from "./landingReview";
import InitialLanding from "./initialLanding";
import { Modal, isMobileDevice } from "./mobileModal";

const LandingPage = () => {
  const [isModalVisible, setModalVisible] = useState(false);

  useEffect(() => {
    if (isMobileDevice()) {
      setModalVisible(true);
      document.body.style.overflow = "hidden";
    } else {
      document.body.style.overflow = "unset";
    }
  }, []);

  const closeModal = () => {
    setModalVisible(false);
    document.body.style.overflow = "unset";
  };

  const sectionStyle: CSSProperties = {
    height: "100vh",
  };

  const containerStyle: CSSProperties = {
    scrollSnapType: "y mandatory",
    overflowY: isModalVisible ? "hidden" : "scroll",
    height: "100vh",
    width: "100vw",
    filter: isModalVisible ? "blur(5px)" : "none",
    pointerEvents: isModalVisible ? "none" : "auto",
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
    <div>
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
      <Modal
        isVisible={isModalVisible}
        message={`자기소개서 첨삭은 PC에서\n더욱 원활하게 진행할 수 있어요\nPC로 접속해주세요!`}
        onClose={closeModal}
      />
    </div>
  );
};

export default LandingPage;
