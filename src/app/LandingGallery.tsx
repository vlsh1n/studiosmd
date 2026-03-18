import Image from "next/image";
import centralImage from "../../design/central.png";
import hall1Image from "../../design/hall1.png";
import hall2Image from "../../design/hall2.png";
import hall3Image from "../../design/hall3.png";
import hall4Image from "../../design/hall4.png";

export default function LandingGallery() {
  return (
    <div className="landing-gallery" aria-hidden="true">
      <figure className="landing-gallery-card landing-gallery-card-left-outer">
        <Image src={hall1Image} alt="" className="landing-gallery-image" />
      </figure>
      <figure className="landing-gallery-card landing-gallery-card-left-inner">
        <Image src={hall2Image} alt="" className="landing-gallery-image" />
      </figure>

      <figure className="landing-gallery-central">
        <Image src={centralImage} alt="" className="landing-gallery-image" priority />
      </figure>

      <figure className="landing-gallery-card landing-gallery-card-right-inner">
        <Image src={hall3Image} alt="" className="landing-gallery-image" />
      </figure>
      <figure className="landing-gallery-card landing-gallery-card-right-outer">
        <Image src={hall4Image} alt="" className="landing-gallery-image" />
      </figure>
    </div>
  );
}
