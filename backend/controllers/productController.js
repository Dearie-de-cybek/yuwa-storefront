const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();

// ... (Keep getProducts and getProductById exactly as they are) ...

// @desc    Delete a product
// @route   DELETE /api/products/:id
// @access  Private/Admin
const deleteProduct = async (req, res) => {
  try {
    const { id } = req.params;
    
    // We must delete variants/orderItems first (Foreign Key constraints)
    // For now, let's just delete the product and cascade
    // Note: In production, you might want "Soft Delete" (active: false)
    
    // 1. Delete Variants
    await prisma.variant.deleteMany({ where: { productId: id } });

    // 2. Delete Product
    await prisma.product.delete({ where: { id } });
    
    res.json({ message: 'Product removed' });
  } catch (error) {
    res.status(500).json({ message: 'Server Error', error: error.message });
  }
};

// @desc    Create a product
// @route   POST /api/products
// @access  Private/Admin
const createProduct = async (req, res) => {
  try {
    // Create a "Draft" product that you can edit immediately
    const product = await prisma.product.create({
      data: {
        name: 'Sample Product',
        price: 0,
        user: { connect: { id: req.user.id } }, // Connect to the Admin who created it
        image: '/images/sample.jpg',
        category: 'Sample Category',
        countInStock: 0,
        numReviews: 0,
        description: 'Sample description',
      },
    });
    res.status(201).json(product);
  } catch (error) {
    // Note: You need to add 'userId' to your Product model in Prisma first!
    // Or we can simplify and not link it to a user for now.
    console.error(error);
    res.status(500).json({ message: 'Failed to create product' });
  }
};

// EXPORT ALL
module.exports = { 
  getProducts, 
  getProductById, 
  deleteProduct,
  // createProduct (Uncomment when ready)
};