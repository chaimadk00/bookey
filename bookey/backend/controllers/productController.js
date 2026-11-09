import mongoose from "mongoose";
import Product from "../models/Product.js";

// Helper to validate 24-character hexadecimal MongoDB ObjectId
const isValidObjectId = (id) => mongoose.Types.ObjectId.isValid(id);

// GET /api/products - Retrieve all products (Public)
export const getAllProducts = async (req, res) => {
  try {
    const { category, search } = req.query;

    let query = {};
    if (category && category !== "All") {
      query.category = new RegExp(`^${category}$`, "i");
    }
    if (search) {
      query.$or = [
        { name: new RegExp(search, "i") },
        { description: new RegExp(search, "i") },
        { author: new RegExp(search, "i") }
      ];
    }

    const products = await Product.find(query).sort({ createdAt: -1 });
    return res.status(200).json({
      success: true,
      statusCode: 200,
      count: products.length,
      products
    });
  } catch (error) {
    console.error("Get Products Error:", error);
    return res.status(500).json({
      success: false,
      statusCode: 500,
      message: "Server error while retrieving products from database.",
      error: error.message
    });
  }
};

// GET /api/products/:id - Retrieve one product by ID (Public)
export const getProductById = async (req, res) => {
  try {
    const { id } = req.params;

    if (!isValidObjectId(id)) {
      return res.status(400).json({
        success: false,
        statusCode: 400,
        message: "Invalid product ID format. Must be a valid 24-character hex string."
      });
    }

    const product = await Product.findById(id);
    if (!product) {
      return res.status(404).json({
        success: false,
        statusCode: 404,
        message: `Product with ID ${id} not found.`
      });
    }

    return res.status(200).json({
      success: true,
      statusCode: 200,
      product
    });
  } catch (error) {
    console.error("Get Product By ID Error:", error);
    return res.status(500).json({
      success: false,
      statusCode: 500,
      message: "Server error while retrieving product from database.",
      error: error.message
    });
  }
};

// POST /api/products - Create a new product (JWT Required)
export const createProduct = async (req, res) => {
  try {
    const { name, description, price, category, imageUrl, stock, author, year, color } = req.body;

    // Validate required fields
    if (!name || !description || price === undefined || !category) {
      return res.status(400).json({
        success: false,
        statusCode: 400,
        message: "Validation Error: 'name', 'description', 'price', and 'category' are required."
      });
    }

    if (typeof price !== "number" || price < 0) {
      return res.status(400).json({
        success: false,
        statusCode: 400,
        message: "Validation Error: 'price' must be a non-negative number."
      });
    }

    if (stock !== undefined && (typeof stock !== "number" || stock < 0)) {
      return res.status(400).json({
        success: false,
        statusCode: 400,
        message: "Validation Error: 'stock' must be a non-negative number."
      });
    }

    const newProduct = await Product.create({
      name: name.trim(),
      description: description.trim(),
      price,
      category: category.trim(),
      imageUrl: imageUrl || "",
      stock: stock !== undefined ? stock : 10,
      author: author || "Unknown",
      year: year || new Date().getFullYear(),
      color: color || "#3A4E38"
    });

    return res.status(201).json({
      success: true,
      statusCode: 201,
      message: "Product created successfully in database.",
      product: newProduct
    });
  } catch (error) {
    console.error("Create Product Error:", error);
    return res.status(500).json({
      success: false,
      statusCode: 500,
      message: "Server error while creating product in database.",
      error: error.message
    });
  }
};

// PUT /api/products/:id - Update an existing product (JWT Required)
export const updateProduct = async (req, res) => {
  try {
    const { id } = req.params;

    if (!isValidObjectId(id)) {
      return res.status(400).json({
        success: false,
        statusCode: 400,
        message: "Invalid product ID format."
      });
    }

    const { name, description, price, category, imageUrl, stock, author, year, color } = req.body;

    if (price !== undefined && (typeof price !== "number" || price < 0)) {
      return res.status(400).json({
        success: false,
        statusCode: 400,
        message: "Validation Error: 'price' must be a non-negative number."
      });
    }

    if (stock !== undefined && (typeof stock !== "number" || stock < 0)) {
      return res.status(400).json({
        success: false,
        statusCode: 400,
        message: "Validation Error: 'stock' must be a non-negative number."
      });
    }

    const existingProduct = await Product.findById(id);
    if (!existingProduct) {
      return res.status(404).json({
        success: false,
        statusCode: 404,
        message: `Product with ID ${id} not found.`
      });
    }

    const updatedProduct = await Product.findByIdAndUpdate(
      id,
      {
        ...(name && { name: name.trim() }),
        ...(description && { description: description.trim() }),
        ...(price !== undefined && { price }),
        ...(category && { category: category.trim() }),
        ...(imageUrl !== undefined && { imageUrl }),
        ...(stock !== undefined && { stock }),
        ...(author && { author }),
        ...(year && { year }),
        ...(color && { color })
      },
      { returnDocument: 'after', runValidators: true }
    );

    return res.status(200).json({
      success: true,
      statusCode: 200,
      message: "Product updated successfully in database.",
      product: updatedProduct
    });
  } catch (error) {
    console.error("Update Product Error:", error);
    return res.status(500).json({
      success: false,
      statusCode: 500,
      message: "Server error while updating product in database.",
      error: error.message
    });
  }
};

// DELETE /api/products/:id - Delete a product (JWT Required)
export const deleteProduct = async (req, res) => {
  try {
    const { id } = req.params;

    if (!isValidObjectId(id)) {
      return res.status(400).json({
        success: false,
        statusCode: 400,
        message: "Invalid product ID format."
      });
    }

    const product = await Product.findByIdAndDelete(id);
    if (!product) {
      return res.status(404).json({
        success: false,
        statusCode: 404,
        message: `Product with ID ${id} not found.`
      });
    }

    return res.status(200).json({
      success: true,
      statusCode: 200,
      message: `Product "${product.name}" (ID: ${id}) deleted successfully from database.`
    });
  } catch (error) {
    console.error("Delete Product Error:", error);
    return res.status(500).json({
      success: false,
      statusCode: 500,
      message: "Server error while deleting product from database.",
      error: error.message
    });
  }
};
