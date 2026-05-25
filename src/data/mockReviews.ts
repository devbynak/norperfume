export interface Review {
  id: string;
  rating: number;
  review: string;
  user_id: string;
  created_at: string;
  user_name?: string;
  scent?: 'musk' | 'aqua';
}

export const mockReviews: Review[] = [
  {
    id: "mock-1",
    rating: 5,
    review: "Absolutely love the Musk NOR fragrance! It has a very sophisticated, warm, and woody musk scent that makes my car feel like a luxury lounge. Lasts a really long time too.",
    user_id: "mock-user-1",
    created_at: "2024-03-15T10:00:00Z",
    user_name: "Meera",
    scent: "musk"
  },
  {
    id: "mock-2",
    rating: 5,
    review: "I've tried many car perfumes, but the Aqua one is unmatched. Extremely fresh, reminds me of a cool ocean breeze. It completely eliminates any odor. Must buy!",
    user_id: "mock-user-2",
    created_at: "2024-03-20T14:30:00Z",
    user_name: "Rahul",
    scent: "aqua"
  },
  {
    id: "mock-3",
    rating: 4,
    review: "The Musk perfume has such a rich and premium vibe. It's not overpowering at all, just a smooth, warm background scent. Highly recommend it, though I wish they sold a larger spray bottle.",
    user_id: "mock-user-3",
    created_at: "2024-03-25T09:15:00Z",
    user_name: "Irfan",
    scent: "musk"
  },
  {
    id: "mock-4",
    rating: 5,
    review: "Aqua NOR is extremely fresh and clean. Very refreshing for daily morning commutes. The packaging is premium and it fits perfectly in my dashboard.",
    user_id: "mock-user-4",
    created_at: "2024-04-02T11:45:00Z",
    user_name: "Priya",
    scent: "aqua"
  },
  {
    id: "mock-5",
    rating: 4,
    review: "Superb musk fragrance. The diffusion is slow and steady, doesn't cause any headache. Docked one star because shipping took 4 days to Bangalore, but the product is fantastic!",
    user_id: "mock-user-5",
    created_at: "2024-04-05T16:20:00Z",
    user_name: "Amit",
    scent: "musk"
  },
  {
    id: "mock-6",
    rating: 5,
    review: "Highly impressed with the Aqua scent. It's cool, breezy, and gives an instant premium feel. Everyone who sits in my car asks which perfume this is.",
    user_id: "mock-user-6",
    created_at: "2024-04-10T08:00:00Z",
    user_name: "Suresh",
    scent: "aqua"
  },
  {
    id: "mock-7",
    rating: 5,
    review: "Bought Musk NOR as a gift for my husband's new car and he is absolutely obsessed. It smells incredibly luxurious and premium.",
    user_id: "mock-user-7",
    created_at: "2024-04-15T13:10:00Z",
    user_name: "Divya",
    scent: "musk"
  },
  {
    id: "mock-8",
    rating: 4,
    review: "Excellent ocean fresh scent. It feels very clean and breezy, perfect for hot summers. Safe packaging and fast delivery.",
    user_id: "mock-user-8",
    created_at: "2024-04-20T17:50:00Z",
    user_name: "Kabir",
    scent: "aqua"
  },
  {
    id: "mock-9",
    rating: 3,
    review: "The Musk NOR fragrance is highly premium and classy, but it is a bit too warm for my personal taste. If you love deep, bold woody notes you will love it. The tag design is excellent though.",
    user_id: "mock-user-9",
    created_at: "2024-04-25T10:30:00Z",
    user_name: "Rohit",
    scent: "musk"
  },
  {
    id: "mock-10",
    rating: 4,
    review: "The Aqua perfume smells exactly like a premium sea breeze. It's subtle yet keeps the car smelling incredibly clean. Value for money, but the spray nozzle could be slightly smoother.",
    user_id: "mock-user-10",
    created_at: "2024-05-01T12:00:00Z",
    user_name: "Anjali",
    scent: "aqua"
  },
  {
    id: "mock-11",
    rating: 5,
    review: "Musk NOR is hands down the best car scent I've ever owned. Very classy and persistent. Very happy with the purchase.",
    user_id: "mock-user-11",
    created_at: "2024-05-03T15:40:00Z",
    user_name: "Rohan",
    scent: "musk"
  },
  {
    id: "mock-12",
    rating: 3,
    review: "Smells amazing, but I feel the Aqua scent fades a bit quicker in hot afternoon sun. It still lasts around a month, but I expected it to last a bit longer. Still, the scent itself is wonderful.",
    user_id: "mock-user-12",
    created_at: "2024-05-04T09:20:00Z",
    user_name: "Aisha",
    scent: "aqua"
  },
  {
    id: "mock-13",
    rating: 4,
    review: "The Musk diffusion tag looks highly sophisticated and the rich woody aroma is so calming. Will definitely buy a refill soon.",
    user_id: "mock-user-13",
    created_at: "2024-05-05T14:10:00Z",
    user_name: "Vikrant",
    scent: "musk"
  },
  {
    id: "mock-14",
    rating: 5,
    review: "Tested the Aqua scent today. Very pleasant and refreshing, not artificial at all. The design of the diffuser is beautiful.",
    user_id: "mock-user-14",
    created_at: "2024-05-06T11:30:00Z",
    user_name: "Neha",
    scent: "aqua"
  },
  {
    id: "mock-15",
    rating: 5,
    review: "Musk NOR is pure luxury. It has transformed my driving experience. Deep, rich, and classy.",
    user_id: "mock-user-15",
    created_at: "2024-05-07T16:00:00Z",
    user_name: "Arjun",
    scent: "musk"
  }
];

export const getMockReviewsForProduct = (productId: string): Review[] => {
  const isMusk = productId.includes('9197068222690') || productId.toLowerCase().includes('musk') || productId.toLowerCase().includes('mask');
  const isAqua = productId.includes('9197068255458') || productId.toLowerCase().includes('aqua');
  
  if (isMusk) {
    return mockReviews.filter(r => r.scent === 'musk').map(r => ({ ...r, product_id: productId }));
  }
  if (isAqua) {
    return mockReviews.filter(r => r.scent === 'aqua').map(r => ({ ...r, product_id: productId }));
  }
  return mockReviews.map(r => ({ ...r, product_id: productId }));
};
