// components/HowItWorksSection.tsx
'use client';

import Image from 'next/image';

const steps = [
 {
   number: "1",
   title: "Choose Category Below",
   description: "Select the type of verification you need - whether it's romance, vendor, platform or phone scams.",
 },
 {
   number: "2",
   title: "Submit Details",
   description: "Share relevant information with our experts through our secure forms and verification process.",
 },
 {
   number: "3", 
   title: "Expert Review",
   description: "Our experienced analysts investigate thoroughly and provide feedback within a few hours.",
 }
];

export default function HowItWorksSection() {
 return (
   <section id="works" className="relative bg-gradient-to-b from-slate-900 to-slate-800 py-10 sm:py-16 lg:py-24">
     <div className="px-4 mx-auto max-w-7xl sm:px-6 lg:px-8">
       <div className="max-w-2xl mx-auto text-center">
         <h2 className="text-4xl text-white font-extrabold mx-auto md:text-6xl lg:text-5xl">
           Our Expert Review Process
         </h2>
         <p className="max-w-2xl mx-auto mt-4 text-base text-gray-400 leading-relaxed md:text-2xl">
           Professional analysts help protect you from potential scams
         </p>
       </div>

       <div className="relative mt-12 lg:mt-20">
         <div className="absolute inset-x-0 hidden xl:px-44 top-2 md:block md:px-20 lg:px-28">
           <Image
             alt="Process flow line"
             src="https://cdn.rareblocks.xyz/collection/celebration/images/steps/2/curved-dotted-line.svg"
             width={1000}
             height={500}
             className="w-full"
             priority
           />
         </div>

         <div className="relative grid grid-cols-1 text-center gap-y-12 md:grid-cols-3 gap-x-12">
           {steps.map((step, index) => (
             <div key={index} className="group transition-all duration-300 hover:-translate-y-2">
               <div className="flex items-center justify-center w-16 h-16 mx-auto bg-white border-2 border-indigo-500 rounded-full shadow-lg shadow-indigo-500/30 group-hover:border-indigo-600 group-hover:shadow-indigo-500/50">
                 <span className="text-xl font-semibold text-indigo-700 group-hover:text-indigo-800">
                   {step.number}
                 </span>
               </div>
               <h3 className="mt-6 text-xl text-white font-semibold leading-tight md:mt-10 group-hover:text-indigo-300">
                 {step.title}
               </h3>
               <p className="mt-4 text-base text-gray-400 md:text-lg group-hover:text-gray-300">
                 {step.description}
               </p>
             </div>
           ))}
         </div>
       </div>
     </div>

     {/* Enhanced gradient background effect */}
     <div 
       className="absolute inset-0 m-auto max-w-xs h-[357px] blur-[118px] sm:max-w-md md:max-w-lg"
       style={{
         background: 'radial-gradient(circle, rgba(79, 70, 229, 0.2) 0%, rgba(59, 130, 246, 0.2) 50%, rgba(147, 51, 234, 0.2) 100%)'
       }}
     />

     {/* Optional: Add decorative elements */}
     <div className="absolute top-0 right-0 -mt-4 mr-4 hidden lg:block">
       <svg className="w-24 h-24 text-indigo-500/10" viewBox="0 0 100 100" fill="currentColor">
         <circle cx="50" cy="50" r="40" />
       </svg>
     </div>
   </section>
 );
}