import mongoose from "mongoose";

const productSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: [true, "Product name is required"],
      trim: true
    },
    description: {
      type: String,
      required: [true, "Product description is required"],
      trim: true
    },
    price: {
      type: Number,
      required: [true, "Product price is required"],
      min: [0, "Price must be a positive number"]
    },
    category: {
      type: String,
      required: [true, "Product category is required"],
      trim: true
    },
    imageUrl: {
      type: String,
      default: ""
    },
    stock: {
      type: Number,
      required: [true, "Stock quantity is required"],
      min: [0, "Stock cannot be negative"],
      default: 10
    },
    // Optional fields for Algerian bookstore literature context
    author: {
      type: String,
      default: "Unknown"
    },
    year: {
      type: Number,
      default: 2000
    },
    color: {
      type: String,
      default: "#3A4E38"
    }
  },
  {
    timestamps: true
  }
);

const Product = mongoose.model("Product", productSchema);

export default Product;
