import dotenv from "dotenv";
import mongoose from "mongoose";
import bcrypt from "bcryptjs";
import { connectDB } from "./config/db.js";
import Product from "./models/Product.js";
import User from "./models/User.js";

dotenv.config();

const sampleBooks = [
  {
    name: "Nedjma",
    description: "A landmark of Algerian literature: four men circle one elusive woman, and through her, the story of a nation.",
    price: 1200,
    category: "Novel",
    imageUrl: "https://images.unsplash.com/photo-1544716278-ca5e3f4abd8c?w=500",
    stock: 25,
    author: "Kateb Yacine",
    year: 1956,
    color: "#0b5d3b"
  },
  {
    name: "The Stranger",
    description: "Set in Algiers, the story of Meursault, a man who meets the world with quiet indifference.",
    price: 900,
    category: "Novel",
    imageUrl: "https://images.unsplash.com/photo-1512820790803-83ca734da794?w=500",
    stock: 18,
    author: "Albert Camus",
    year: 1942,
    color: "#8c2f39"
  },
  {
    name: "Memory in the Flesh",
    description: "A painter who lost his arm in the war meets the daughter of his old commander in Paris.",
    price: 1500,
    category: "Novel",
    imageUrl: "https://images.unsplash.com/photo-1532012164546-f432f2e3edd1?w=500",
    stock: 12,
    author: "Ahlam Mosteghanemi",
    year: 1993,
    color: "#183f6e"
  },
  {
    name: "The Swallows of Kabul",
    description: "Two couples try to hold on to their humanity in Kabul under Taliban rule.",
    price: 1300,
    category: "Novel",
    imageUrl: "https://images.unsplash.com/photo-1495640388908-05fa85288e61?w=500",
    stock: 15,
    author: "Yasmina Khadra",
    year: 2002,
    color: "#8a4b14"
  },
  {
    name: "The Meursault Investigation",
    description: "The brother of the man killed in The Stranger finally tells his side of the story.",
    price: 1400,
    category: "Novel",
    imageUrl: "https://images.unsplash.com/photo-1497633762265-9d179a990aa6?w=500",
    stock: 20,
    author: "Kamel Daoud",
    year: 2013,
    color: "#3d405b"
  },
  {
    name: "The Poor Man's Son",
    description: "The childhood of Menrad, a boy from a Kabyle village who fights to get an education.",
    price: 1000,
    category: "Novel",
    imageUrl: "https://images.unsplash.com/photo-1524995997946-a1c2e315a42f?w=500",
    stock: 14,
    author: "Mouloud Feraoun",
    year: 1950,
    color: "#4f5440"
  },
  {
    name: "Fantasia: An Algerian Cavalcade",
    description: "Autobiography and history woven together, from the 1830 conquest to the war of independence.",
    price: 1600,
    category: "History",
    imageUrl: "https://images.unsplash.com/photo-1463320726281-696a485928c7?w=500",
    stock: 9,
    author: "Assia Djebar",
    year: 1985,
    color: "#5e2a6e"
  },
  {
    name: "The Wretched of the Earth",
    description: "A powerful essay on colonialism and liberation, shaped by Fanon's years in Algeria.",
    price: 1350,
    category: "Essay",
    imageUrl: "https://images.unsplash.com/photo-1506880018603-83d5b814b5a6?w=500",
    stock: 22,
    author: "Frantz Fanon",
    year: 1961,
    color: "#8e1a24"
  },
  {
    name: "A Savage War of Peace",
    description: "A detailed history of Algeria's war of independence, 1954 to 1962.",
    price: 2200,
    category: "History",
    imageUrl: "https://images.unsplash.com/photo-1516979187457-637abb4f9353?w=500",
    stock: 7,
    author: "Alistair Horne",
    year: 1977,
    color: "#3a3d55"
  }
];

export const seedDatabase = async () => {
  const connected = await connectDB();
  if (!connected) {
    console.error("[Seeding Aborted] Could not connect to MongoDB database.");
    process.exit(1);
  }

  try {
    // Clear existing products
    await Product.deleteMany({});
    console.log("[Seeder] Cleared existing products collection.");

    // Insert sample products
    const inserted = await Product.insertMany(sampleBooks);
    console.log(`[Seeder] Successfully seeded ${inserted.length} sample Algerian books into MongoDB!`);

    // Create a demo test user
    const existingUser = await User.findOne({ email: "student@ensta.dz" });
    if (!existingUser) {
      const passwordHash = await bcrypt.hash("password123", 10);
      await User.create({
        name: "ENSTA Student",
        email: "student@ensta.dz",
        passwordHash
      });
      console.log(`[Seeder] Created demo user: student@ensta.dz (Password: password123)`);
    } else {
      console.log(`[Seeder] Demo user student@ensta.dz already exists.`);
    }

    console.log("[Seeder] Database seeding finished successfully!");
    process.exit(0);
  } catch (error) {
    console.error("[Seeder Error]", error);
    process.exit(1);
  }
};

// Run if called directly
seedDatabase();
