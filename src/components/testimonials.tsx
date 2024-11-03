import Image from "next/image";
import { Card, CardContent } from "@/components/ui/card";

export function Testimonials() {
  return (
    <section className="container flex flex-col items-center gap-3 py-24 sm:gap-7">
      <div className="flex flex-col gap-2">
        <span className="font-bold uppercase text-primary text-center text-3xl sm:text-4xl">Testimonials</span>
        <h2 className="font-heading text-3xl font-semibold tracking-tight sm:text-4xl text-balance text-center">
          Success Stories
        </h2>
      </div>
      <p className="text-lg text-muted-foreground text-balance max-w-lg text-center">
        Real stories from people who avoided scams and protected their interests with our help.
      </p>
      <div className="flex flex-row gap-7 mt-7 overflow-x-auto">
        <Card className="inline-block break-inside-avoid shadow-lg">
          <CardContent className="flex flex-col items-start gap-4 divide-y p-7">
            <p className="text-foreground">
              &quot;Thanks to this platform, I discovered my online romance was actually a scam before sending any money. The verification process revealed that the photos were stolen from someone else's social media. You saved me from heartbreak and financial loss.&quot;
            </p>
            <div className="flex items-center gap-4 w-full pt-4">
              <div className="relative w-10 h-10">
                <Image
                  alt="Sarah's Picture"
                  src="/images/testimonial-4.avif"
                  fill
                  className="rounded-full object-cover"
                />
              </div>
              <div>
                <p className="font-semibold leading-none text-foreground">Sarah</p>
                <p className="mt-1 leading-none text-muted-foreground">Romance Scam Avoided</p>
              </div>
            </div>
          </CardContent>
        </Card>
        <Card className="inline-block break-inside-avoid shadow-lg">
          <CardContent className="flex flex-col items-start gap-4 divide-y p-7">
            <p className="text-foreground">
              &quot;I was about to invest a large sum in what seemed like a legitimate crypto platform. The expert review revealed multiple red flags and helped me dodge a bullet. Their thorough analysis probably saved my life savings.&quot;
            </p>
            <div className="flex items-center gap-4 w-full pt-4">
              <div className="relative w-10 h-10">
                <Image
                  alt="James's Picture"
                  src="/images/testimonial-5.avif"
                  fill
                  className="rounded-full object-cover"
                />
              </div>
              <div>
                <p className="font-semibold leading-none text-foreground">James</p>
                <p className="mt-1 leading-none text-muted-foreground">Investment Scam Prevented</p>
              </div>
            </div>
          </CardContent>
        </Card>
        <Card className="inline-block break-inside-avoid shadow-lg">
          <CardContent className="flex flex-col items-start gap-4 divide-y p-7">
            <p className="text-foreground">
              &quot;When I received a suspicious call about my 'compromised' bank account, I used this platform to verify. Turns out it was a known phone scam. The quick response and guidance helped me protect my personal information and bank details.&quot;
            </p>
            <div className="flex items-center gap-4 w-full pt-4">
              <div className="relative w-10 h-10">
                <Image
                  alt="Maria's Picture"
                  src="/images/testimonial-6.avif"
                  fill
                  className="rounded-full object-cover"
                />
              </div>
              <div>
                <p className="font-semibold leading-none text-foreground">Maria</p>
                <p className="mt-1 leading-none text-muted-foreground">Phone Scam Identified</p>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </section>
  );
}
