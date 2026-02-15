const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();

// @desc    Fetch all products (Public)
const getProducts = async (req, res) => {
  const products = await prisma.product.findMany({
    include: { variants: true },
    orderBy: { createdAt: 'desc' }
  });
  res.json(products);
};

// @desc    Fetch single product (Public)
const getProductById = async (req, res) => {
  const product = await prisma.product.findUnique({
    where: { id: req.params.id },
    include: { variants: true }
  });
  if (product) res.json(product);
  else res.status(404).json({ message: 'Product not found' });
};

// @desc    Create a "Draft" Product (Admin)
// @route   POST /api/products
const createProduct = async (req, res) => {
  try {
    const product = await prisma.product.create({
      data: {
        name: 'New Draft Product',
        price: 0.00,
        description: 'Describe your masterpiece...',
        category: 'Uncategorized',
        images: ['https://via.placeholder.com/300'], // Default placeholder
        material: 'Silk',
        careInstructions: ['Dry Clean Only'],
        details: ['Handmade in Lagos'],
      }
    });
    res.status(201).json(product);
  } catch (error) {
    res.status(500).json({ message: 'Failed to create draft', error: error.message });
  }
};

// @desc    Update a Product (The Big One)
// @route   PUT /api/products/:id
const updateProduct = async (req, res) => {
  const { 
    name, price, description, category, material, 
    careInstructions, details, images, variants 
  } = req.body;

  try {
    // 1. Transaction: Update Product AND Handle Variants safely
    const updatedProduct = await prisma.$transaction(async (prisma) => {
      
      // A. Update Base Fields
      const product = await prisma.product.update({
        where: { id: req.params.id },
        data: {
          name,
          price: parseFloat(price),
          description,
          category,
          material,
          careInstructions, // Expecting Array of Strings
          details,          // Expecting Array of Strings
          images,           // Expecting Array of Strings
        },
      });

      // B. Handle Variants (The "Wipe and Replace" Strategy)
      // This is safer for consistency than trying to diff the changes manually
      if (variants && variants.length > 0) {
        await prisma.variant.deleteMany({ where: { productId: req.params.id } });
        
        await prisma.variant.createMany({
          data: variants.map(v => ({
            productId: req.params.id,
            color: v.color,
            size: v.size,
            stock: parseInt(v.stock)
          }))
        });
      }

      return product;
    });

    // C. Fetch the final result with new variants
    const finalResult = await prisma.product.findUnique({
      where: { id: req.params.id },
      include: { variants: true }
    });

    res.json(finalResult);

  } catch (error) {
    console.error(error);
    res.status(400).json({ message: 'Update failed', error: error.message });
  }
};

// @desc    Delete Product (Admin)
// @route   DELETE /api/products/:id
const deleteProduct = async (req, res) => {
  try {
    const { id } = req.params;
    // Cascade delete handles variants automatically due to schema relation
    await prisma.product.delete({ where: { id } });
    res.json({ message: 'Product removed' });
  } catch (error) {
    res.status(500).json({ message: 'Server Error', error: error.message });
  }
};

module.exports = { 
  getProducts, 
  getProductById, 
  createProduct, 
  updateProduct, 
  deleteProduct 
};