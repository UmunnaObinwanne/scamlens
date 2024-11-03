import Link from "next/link";
import Image from "next/image";

import { Button } from "@/components/ui/button";

export function Hero() {
  return (
    <section className="container flex flex-col items-center gap-8 pb-28 pt-20 sm:gap-10">
      <h1 className="max-w-2xl text-center font-heading text-4xl font-semibold sm:text-5xl tracking-tight">
        Wait... IT MIGHT BE FRAUD
      </h1>
      <p className="max-w-lg text-center text-lg text-muted-foreground sm:text-xl">
        Get human expert analysis before making that decision...
      </p>
      <div className="grid grid gap-3">
        <Button size="lg" asChild className="cursor-pointer">
          <Link href="#works" scroll={true}>Get Started</Link>
        </Button>
      </div>
      <div className="relative sm:mt-8">
        <Image
          alt="SaaS Dashboard"
          src="/images/search-2.jpg"
          width={1000}
          height={698}
          priority
          className="rounded-xl border border-border shadow-lg"
        />
        <div className="absolute inset-0 -z-10 bg-primary/20 [filter:blur(180px)]" />
      </div>
    </section>
  );
}
