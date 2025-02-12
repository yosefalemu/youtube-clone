import db from "@/db";
import { categories } from "@/db/schema/categories";

const youtubeCategories = [
  {
    name: "Music",
    description:
      "Enjoy the latest music videos, albums, and live performances.",
  },
  {
    name: "Gaming",
    description:
      "Watch live streams, game reviews, and walkthroughs of popular video games.",
  },
  {
    name: "News",
    description:
      "Stay updated with the latest local and global news, reports, and analysis.",
  },
  {
    name: "Sports",
    description:
      "Catch highlights, live streams, and analysis of various sports events.",
  },
  {
    name: "Entertainment",
    description:
      "Discover movie trailers, celebrity interviews, and TV show clips.",
  },
  {
    name: "Science & Technology",
    description: "Explore the latest in science, technology, and innovation.",
  },
  {
    name: "Education",
    description:
      "Learn new skills, watch tutorials, and gain knowledge on various subjects.",
  },
  {
    name: "How-to & Style",
    description: "Find DIY tutorials, fashion tips, and beauty hacks.",
  },
  {
    name: "Film & Animation",
    description:
      "Enjoy animated movies, short films, and creative storytelling.",
  },
  {
    name: "Comedy",
    description:
      "Watch stand-up performances, funny sketches, and comedic content.",
  },
  {
    name: "Travel & Events",
    description: "Explore different places, travel vlogs, and event coverage.",
  },
  {
    name: "Autos & Vehicles",
    description: "Learn about cars, motorbikes, and everything automotive.",
  },
  {
    name: "People & Blogs",
    description: "Personal vlogs, daily life content, and unique perspectives.",
  },
  {
    name: "Pets & Animals",
    description:
      "Watch adorable pet videos, animal documentaries, and training tips.",
  },
  {
    name: "Lifestyle",
    description: "Covers fitness, wellness, productivity, and personal growth.",
  },
];

const seedCategories = async () => {
  try {
    console.log("Seeding categories...");
    await db.insert(categories).values(youtubeCategories);
    console.log("Categories seeded successfully");
  } catch (error) {
    console.error("Error seeding categories:", error);
    process.exit(1);
  }
};

seedCategories();
