
import { Hero } from "@/components/hero";
import { SocialProof } from "@/components/social-proof";
import { Features } from "@/components/features-section";
import { Testimonials } from "@/components/testimonials";
import { Faq } from "@/components/faq";
import HowItWorks from "@/components/HowItWorks";


export default function HomePage() {
  return (
    <>

      <Hero />
      <SocialProof />
      <HowItWorks/>
      <Features />
      <Testimonials />
      <Faq />
    </>
  );
}
