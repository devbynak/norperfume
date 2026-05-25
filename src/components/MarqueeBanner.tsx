const MarqueeBanner = ({ items, className = "" }: { items: string[]; className?: string }) => {
  const content = (
    <div className="flex items-center shrink-0">
      {items.map((item, i) => (
        <span key={i} className="flex items-center">
          <span className="text-sm font-semibold tracking-wide uppercase text-black mx-4 whitespace-nowrap">
            {item}
          </span>
          <span className="text-black font-bold mx-4">✦</span>
        </span>
      ))}
    </div>
  );

  return (
    <div className={`overflow-hidden py-3 bg-white ${className} w-full flex select-none`}>
      <div className="animate-marquee flex whitespace-nowrap">
        {content}
        {content}
        {content}
        {content}
      </div>
    </div>
  );
};

export default MarqueeBanner;
