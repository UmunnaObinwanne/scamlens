import { Heart, ShoppingBag, Globe, Phone } from "lucide-react";
import Link from "next/link";

export function Features() {
  const categories = [
    {
      icon: <Heart size={24} className="text-primary" />,
      title: "Romance Partner",
      description: "Met someone online? Before investing emotions or money, let us help verify their identity and protect you from romance scams.",
      href: "/romance-verify"
    },
    {
      icon: <ShoppingBag size={24} className="text-primary" />,
      title: "Online Vendor",
      description: "Found a great deal online? Let us verify the seller's credibility before you make a purchase and protect your money.",
      href: "/onlineplatform-verify"
    },
    {
      icon: <Globe size={24} className="text-primary" />,
      title: "Online Platform",
      description: "Considering an investment, course, or service? We'll help verify the platform's legitimacy and check for red flags.",
      href: "/onlineplatform-verify"
    },
    {
      icon: <Phone size={24} className="text-primary" />,
      title: "Phone Call",
      description: "Received a suspicious call about your accounts, taxes, or winnings? Let us help you identify potential phone scams.",
      href: "/verify/phone"
    }
  ];

  return (
    <section className="container flex flex-col items-center gap-6 py-24 sm:gap-7">
      <div className="flex flex-col gap-3">
        <span className="font-bold uppercase text-primary text-center text-3xl sm:text-4xl">Categories</span>
        <h2 className="font-heading text-3xl font-semibold tracking-tight sm:text-4xl text-balance text-center">
          What would you like to verify?
        </h2>
      </div>
      <p className="text-lg text-muted-foreground text-balance max-w-xl text-center">
        Select the category that best matches your concern. Our experts will help you verify legitimacy and protect you from potential scams.
      </p>
      <div className="relative z-10 mx-auto grid max-w-7xl grid-cols-1 py-10 md:grid-cols-2 lg:grid-cols-4">
        {categories.map((category, index) => (
          <Link 
            href={category.href}
            key={index} 
            className="group/feature relative flex flex-col py-10 lg:border-r lg:border-b cursor-pointer 
                       hover:shadow-lg transition-all duration-300 ease-in-out
                       first:lg:border-l"
          >
            <div className="pointer-events-none absolute inset-0 size-full from-primary/20 to-transparent 
                          opacity-0 transition duration-200 group-hover/feature:opacity-100 bg-gradient-to-t" />
            
            {/* New hover effect element */}
            <div className="absolute right-4 top-4 opacity-0 transform translate-x-2 
                          transition-all duration-300 group-hover/feature:opacity-100 
                          group-hover/feature:translate-x-0">
              👆
            </div>

            <div className="relative z-10 mb-4 px-10">
              {category.icon}
            </div>
            <div className="relative z-10 mb-2 px-10 text-lg font-bold">
              <div className="absolute inset-y-0 left-0 h-6 w-1 origin-center rounded-r-full 
                            bg-neutral-300 transition-all duration-200 
                            group-hover/feature:h-8 group-hover/feature:bg-primary" />
              <span className="inline-block">{category.title}</span>
            </div>
            <p className="relative z-10 max-w-xs px-10 text-sm text-muted-foreground">
              {category.description}
            </p>
          </Link>
        ))}
      </div>
    </section>
  );
}