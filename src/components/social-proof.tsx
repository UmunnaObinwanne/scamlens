import Image from "next/image";

export function SocialProof() {
  return (
    <section className="container flex flex-col items-center gap-10 py-24">
      <h2 className="text-center  font-semibold  text-4xl mx-auto md:text-6xl lg:text-2xl">
        Trusted by customer&apos;s on
      </h2>
      <div className="grid w-full grid-cols-4 gap-10 sm:grid-cols-6 sm:gap-12 lg:grid-cols-4">
        <div className="relative col-span-2 h-11 flex-1 sm:h-10 lg:col-span-1">
          <Image alt="Company Logo" src="/images/microsoft.webp" fill className="object-contain" />
        </div>
        <div className="relative col-span-2 h-11 flex-1 sm:h-10 lg:col-span-1">
          <Image alt="Company Logo" src="/images/google.png" fill className="object-contain" />
        </div>
        <div className="relative col-span-2 h-11 flex-1 sm:h-10 lg:col-span-1">
          <Image alt="Company Logo" src="/images/amazon.png" fill className="object-contain" />
        </div>
        <div className="relative col-span-2 h-11 flex-1 sm:h-10 lg:col-span-1 col-start-2 sm:col-start-auto">
          <Image alt="Company Logo" src="/images/facebook.png" fill className="object-contain" />
        </div>
      </div>
    </section>
  );
}

