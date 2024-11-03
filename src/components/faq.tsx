import {
  Accordion,
  AccordionItem,
  AccordionTrigger,
  AccordionContent,
} from "@/components/ui/accordion";

export function Faq() {
  return (
    <section className="container flex flex-col items-center gap-6 py-24 sm:gap-7">
      <div className="flex flex-col gap-3">
        <span className="font-bold uppercase text-primary text-center text-3xl sm:text-4xl">FAQ</span>
        <h2 className="font-heading text-3xl font-semibold tracking-tight sm:text-4xl text-balance text-center">
          Common Questions About Our Service
        </h2>
      </div>
      <p className="text-lg text-muted-foreground text-balance max-w-lg text-center">
        Got questions about protecting yourself from scams? We've got answers.
      </p>
      <Accordion type="single" collapsible className="mt-6 w-full divide-y max-w-3xl">
        <AccordionItem value="item-0" className="border-b-0">
          <AccordionTrigger className="py-6 text-left text-lg hover:no-underline">
            How quickly can I get help with verifying a potential scam?
          </AccordionTrigger>
          <AccordionContent className="text-lg text-muted-foreground">
            Our team typically responds within 24 hours. However, if you indicate that you're under pressure to make an immediate payment or decision, we'll prioritize your case for expedited review to help protect your interests.
          </AccordionContent>
        </AccordionItem>
        <AccordionItem value="item-1" className="border-b-0">
          <AccordionTrigger className="py-6 text-left text-lg hover:no-underline">
            What information do you need to help verify someone's identity?
          </AccordionTrigger>
          <AccordionContent className="text-lg text-muted-foreground">
            We'll need any photographs they've shared, their social media profiles, email addresses, phone numbers, and any other online presence they've shown. Don't worry - we'll guide you through submitting this information securely through our platform.
          </AccordionContent>
        </AccordionItem>
        <AccordionItem value="item-2" className="border-b-0">
          <AccordionTrigger className="py-6 text-left text-lg hover:no-underline">
            How do you protect my personal information when I submit a case?
          </AccordionTrigger>
          <AccordionContent className="text-lg text-muted-foreground">
            Your privacy and security are our top priorities. All information is encrypted and stored securely. We never share your personal details with third parties, and our verification process is completely confidential.
          </AccordionContent>
        </AccordionItem>
        <AccordionItem value="item-3" className="border-b-0">
          <AccordionTrigger className="py-6 text-left text-lg hover:no-underline">
            What are the most common signs of a romance scam?
          </AccordionTrigger>
          <AccordionContent className="text-lg text-muted-foreground">
            Common red flags include requests for money, reluctance to video chat, moving too quickly emotionally, having excuses not to meet in person, and stories about being stuck abroad or in emergencies. Our verification process helps identify these and other warning signs.
          </AccordionContent>
        </AccordionItem>
        <AccordionItem value="item-4" className="border-b-0">
          <AccordionTrigger className="py-6 text-left text-lg hover:no-underline">
            Can you help if I've already sent money to a suspected scammer?
          </AccordionTrigger>
          <AccordionContent className="text-lg text-muted-foreground">
            Yes, we can help. While we focus on prevention, we also provide guidance on steps to take if you've already been scammed, including how to report to relevant authorities, contact your bank, and prevent further losses. The sooner you reach out, the better we can assist.
          </AccordionContent>
        </AccordionItem>
        <AccordionItem value="item-5" className="border-b-0">
          <AccordionTrigger className="py-6 text-left text-lg hover:no-underline">
            What if the website or person I want to verify is legitimate?
          </AccordionTrigger>
          <AccordionContent className="text-lg text-muted-foreground">
            That's great news! We'll provide you with a detailed report confirming their legitimacy, giving you peace of mind to proceed with your relationship or transaction. Better to verify than regret later.
          </AccordionContent>
        </AccordionItem>
      </Accordion>
    </section>
  );
}