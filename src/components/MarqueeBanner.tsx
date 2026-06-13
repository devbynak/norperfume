import React from "react";

const MarqueeBanner = ({ items, className = "" }: { items: string[]; className?: string }) => {
  const content = (
    <div className="flex items-center shrink-0">
      {items.map((item, i) => (
        <span key={i} className="flex items-center">
          <span className="text-[10px] sm:text-xs md:text-sm font-semibold tracking-[0.2em] uppercase text-black mx-4 sm:mx-8 md:mx-12 whitespace-nowrap">
            {item}
          </span>
          <span className="text-black font-bold mx-2 sm:mx-4">✦</span>
        </span>
      ))}
    </div>
  );

  return (
    <div className={`overflow-visible py-3 bg-white ${className} w-full flex select-none items-center`}>
      <div className="animate-marquee flex whitespace-nowrap items-center">
        {content}
        {content}
        {content}
        {content}
      </div>
    </div>
  );
};

export default MarqueeBanner;
