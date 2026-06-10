export interface BlogPost {
  id: string;
  title: string;
  subtitle?: string;
  excerpt: string;
  category: "Scent Science" | "The Heritage" | "Lifestyle" | "Inside the Studio";
  author: string;
  date: string;
  readTime: string;
  image: string;
  content: string;
  featured?: boolean;
  relatedImages?: string[];
}

export const blogPosts: BlogPost[] = [
  {
    id: "legacy-in-motion",
    title: "A Legacy in Motion",
    subtitle: "The Timeless Connection Between Heritage & Scent",
    excerpt: "Exploring how vintage grandeur and classic automotive design inspire our most sophisticated olfactory creations.",
    category: "The Heritage",
    author: "Ameen Kasim",
    date: "June 12, 2026",
    readTime: "8 Min Read",
    image: "/Gemini_Generated_Image_kwi8j2kwi8j2kwi8.jpg",
    featured: true,
    relatedImages: [
      "https://images.unsplash.com/photo-1540962351504-03099e0a754b?auto=format&fit=crop&q=80&w=1000"
    ],
    content: `
      <p class="text-2xl md:text-4xl leading-[1.3] text-white/90 font-light tracking-tight italic border-l-4 border-primary pl-8 md:pl-16 mb-20 max-w-4xl">
        "True luxury is not found in the new, but in the enduring. It is the scent of a sun-drenched estate and the leather of a vintage convertible."
      </p>
      
      <div class="space-y-12">
        <p class="text-white/60 leading-relaxed text-xl md:text-2xl font-light first-letter:text-7xl first-letter:font-display first-letter:text-primary first-letter:mr-4 first-letter:float-left first-letter:leading-[0.8]">
          There is an unmistakable romance in the classics. When we look at a 1960s convertible parked before a grand limestone facade, we don't just see a car; we see a narrative of elegance, speed, and sensory richness.
        </p>

        <h2 class="font-display text-4xl md:text-7xl uppercase text-white tracking-tighter leading-none pt-12">The <span class="text-primary italic font-light lowercase">Grand Tour</span></h2>
        
        <p class="text-white/50 leading-relaxed text-lg md:text-xl font-light">
          Our heritage collection is inspired by the "Grand Tour" era—a time when travel was an art form. We've captured the essence of polished wood, aged tobacco, and the crisp air of the Mediterranean coast.
        </p>

        <div class="grid md:grid-cols-2 gap-12 my-20">
          <div class="aspect-[4/5] rounded-[40px] overflow-hidden group">
            <img src="https://images.unsplash.com/photo-1492144534655-ae79c964c9d7?auto=format&fit=crop&q=80&w=1000" class="w-full h-full object-cover transition-transform duration-1000 group-hover:scale-110" alt="Vintage luxury car" />
          </div>
          <div class="flex flex-col justify-center space-y-8">
            <h3 class="font-display text-3xl uppercase text-white tracking-tighter">Timeless Aesthetics</h3>
            <p class="text-white/40 text-lg font-light">Every NOR perfume bottle is designed to complement the interiors of the world's finest vehicles, from modern supercars to restored classics.</p>
          </div>
        </div>
      </div>
    `
  },
  {
    id: "art-of-distillation",
    title: "The Art of Distillation",
    subtitle: "Precision in Every Droplet",
    excerpt: "Go behind the scenes of our Kerala studio where traditional extraction meets modern olfactory mastery.",
    category: "Inside the Studio",
    author: "Ameen Kasim",
    date: "June 10, 2026",
    readTime: "5 Min Read",
    image: "/Gemini_Generated_Image_im7o6mim7o6mim7o.jpg",
    content: `
      <div class="space-y-16">
        <p class="text-white/60 leading-relaxed text-xl md:text-2xl font-light italic border-l-2 border-primary pl-8">
          The secret to a perfect scent lies in the pour. In our studio, we treat every milliliter of essential oil with the reverence of a master jeweler handling a diamond.
        </p>
        
        <div className="aspect-[16/9] rounded-[40px] overflow-hidden my-20 relative group">
          <img src="/Gemini_Generated_Image_im7o6mim7o6mim7o.jpg" class="w-full h-full object-cover transition-transform duration-1000 group-hover:scale-105" alt="Handcrafted process" />
        </div>

        <p class="text-white/40 text-lg font-light max-w-3xl">
          By manually pouring and blending our extracts, we ensure that the molecular integrity of the botanical oils remains intact, providing a scent that is as pure as nature intended.
        </p>
      </div>
    `
  },
  {
    id: "botanical-alchemy",
    title: "Botanical Alchemy",
    subtitle: "Science in Service of the Soul",
    excerpt: "How laboratory precision transforms raw petals and wood into liquid gold for your vehicle.",
    category: "Scent Science",
    author: "Ameen Kasim",
    date: "June 8, 2026",
    readTime: "6 Min Read",
    image: "https://images.unsplash.com/photo-1581091226825-a6a2a5aee158?q=80&w=1000",
    content: `
      <div class="grid md:grid-cols-3 gap-8 my-20">
        <div class="space-y-6 p-8 rounded-[30px] bg-white/[0.02] border border-white/5">
          <h3 class="text-white font-black uppercase tracking-widest text-xs text-primary">Molecular Analysis</h3>
          <p class="text-white/40 text-sm leading-relaxed">We analyze the aromatic compounds of every botanical batch to ensure consistent performance in automotive environments.</p>
        </div>
        <div class="space-y-6 p-8 rounded-[30px] bg-white/[0.02] border border-white/5 md:mt-12">
          <h3 class="text-white font-black uppercase tracking-widest text-xs text-primary">Thermal Stability</h3>
          <p class="text-white/40 text-sm leading-relaxed">Our scents are engineered to withstand the extreme temperatures found inside luxury cabins without losing their character.</p>
        </div>
        <div class="space-y-6 p-8 rounded-[30px] bg-white/[0.02] border border-white/5 md:mt-24">
          <h3 class="text-white font-black uppercase tracking-widest text-xs text-primary">Pure Extraction</h3>
          <p class="text-white/40 text-sm leading-relaxed">Cold-pressing and steam distillation preserve the therapeutic properties of our 100% natural oil extracts.</p>
        </div>
      </div>
    `
  },
  {
    id: "scent-of-strategy",
    title: "The Scent of Strategy",
    subtitle: "A Game of Olfactory Senses",
    excerpt: "Redefining the art of fragrance through the lens of timeless games and artistic expression.",
    category: "Lifestyle",
    author: "Ameen Kasim",
    date: "June 5, 2026",
    readTime: "4 Min Read",
    image: "https://images.unsplash.com/photo-1586165368502-1bad197a6461?auto=format&fit=crop&q=80&w=2000",
    content: `
      <p class="text-white/60 leading-relaxed text-xl md:text-2xl font-light mb-16">
        Fragrance is a strategic move. It sets the tone for your day, your meeting, and your journey. Like a grandmaster on a chessboard, we carefully position each note to achieve a checkmate of the senses.
      </p>
      
      <div class="aspect-square md:aspect-[21/9] rounded-[40px] overflow-hidden my-20 relative group">
        <img src="https://images.unsplash.com/photo-1529699211952-734e80c4d42b?auto=format&fit=crop&q=80&w=2000" class="w-full h-full object-cover grayscale brightness-125" alt="Artistic chess and perfume" />
        <div class="absolute inset-0 bg-black/20" />
      </div>
    `
  },
  {
    id: "equestrian-spirit",
    title: "The Equestrian Spirit",
    subtitle: "The Great Outdoors, Refined",
    excerpt: "Capturing the essence of the valley estate—where the power of the horse meets the luxury of the drive.",
    category: "Lifestyle",
    author: "Ameen Kasim",
    date: "June 1, 2026",
    readTime: "7 Min Read",
    image: "https://images.unsplash.com/photo-1553284965-83fd3e82fa5a?auto=format&fit=crop&q=80&w=2000",
    content: `
      <div class="space-y-16">
        <p class="text-white/60 leading-relaxed text-xl md:text-2xl font-light">
          There is a profound connection between the equestrian lifestyle and automotive excellence. Both celebrate power, grace, and a deep appreciation for the landscape.
        </p>
        
        <div class="grid grid-cols-2 gap-8 my-20">
          <img src="https://images.unsplash.com/photo-1598970434795-0c54fe7c0648?auto=format&fit=crop&q=80&w=1000" class="aspect-[3/4] rounded-3xl object-cover" alt="Luxury estate" />
          <img src="https://images.unsplash.com/photo-1540962351504-03099e0a754b?auto=format&fit=crop&q=80&w=1000" class="aspect-[3/4] rounded-3xl object-cover mt-24" alt="Luxury car interior" />
        </div>
      </div>
    `
  }
];
