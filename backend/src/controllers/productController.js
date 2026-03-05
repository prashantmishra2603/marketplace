import Product from '../models/Product.js';

// @desc    Create new product
// @route   POST /api/products
// @access  Private (Brand only)
export const createProduct = async (req, res) => {
  try {
    const { name, description, price, category, sizes, colors, stock, status } = req.body;

    // Validate category
    const validCategories = [
      'tops', 'bottoms', 'dresses', 'outerwear', 'shoes', 
      'accessories', 'activewear', 'swimwear', 'formal', 'casual'
    ];
    
    if (!validCategories.includes(category)) {
      return res.status(400).json({
        success: false,
        message: 'Invalid category',
      });
    }

    const product = await Product.create({
      name,
      description,
      price,
      category,
      sizes: sizes || ['One Size'],
      colors: colors || [],
      stock: stock || 0,
      status: status || 'draft',
      brand: req.user._id,
      images: req.files ? req.files.map(file => ({
        url: file.path,
        publicId: file.filename,
      })) : [],
    });

    res.status(201).json({
      success: true,
      message: 'Product created successfully',
      data: product,
    });
  } catch (error) {
    console.error('Create product error:', error);
    res.status(500).json({
      success: false,
      message: 'Server error creating product',
    });
  }
};

// @desc    Get all products for brand (dashboard)
// @route   GET /api/products/brand
// @access  Private (Brand only)
export const getBrandProducts = async (req, res) => {
  try {
    const { page = 1, limit = 10, status } = req.query;

    const query = { brand: req.user._id, isDeleted: false };
    
    if (status) {
      query.status = status;
    }

    const products = await Product.find(query)
      .sort({ createdAt: -1 })
      .skip((page - 1) * limit)
      .limit(parseInt(limit));

    const total = await Product.countDocuments(query);

    // Get summary
    const summary = await Product.aggregate([
      { $match: { brand: req.user._id, isDeleted: false } },
      {
        $group: {
          _id: '$status',
          count: { $sum: 1 },
        },
      },
    ]);

    const summaryObj = {
      total: 0,
      published: 0,
      draft: 0,
      archived: 0,
    };

    summary.forEach((item) => {
      summaryObj[item._id] = item.count;
      summaryObj.total += item.count;
    });

    res.json({
      success: true,
      data: {
        products,
        pagination: {
          page: parseInt(page),
          limit: parseInt(limit),
          total,
          pages: Math.ceil(total / limit),
        },
        summary: summaryObj,
      },
    });
  } catch (error) {
    console.error('Get brand products error:', error);
    res.status(500).json({
      success: false,
      message: 'Server error fetching products',
    });
  }
};

// @desc    Get single product for brand
// @route   GET /api/products/brand/:id
// @access  Private (Brand only - own products)
export const getBrandProduct = async (req, res) => {
  try {
    const product = await Product.findOne({
      _id: req.params.id,
      brand: req.user._id,
      isDeleted: false,
    });

    if (!product) {
      return res.status(404).json({
        success: false,
        message: 'Product not found',
      });
    }

    res.json({
      success: true,
      data: product,
    });
  } catch (error) {
    console.error('Get brand product error:', error);
    res.status(500).json({
      success: false,
      message: 'Server error fetching product',
    });
  }
};

// @desc    Update product
// @route   PUT /api/products/brand/:id
// @access  Private (Brand only - own products)
export const updateProduct = async (req, res) => {
  try {
    const { name, description, price, category, sizes, colors, stock, status } = req.body;

    let product = await Product.findOne({
      _id: req.params.id,
      brand: req.user._id,
      isDeleted: false,
    });

    if (!product) {
      return res.status(404).json({
        success: false,
        message: 'Product not found',
      });
    }

    // Update fields
    if (name) product.name = name;
    if (description) product.description = description;
    if (price !== undefined) product.price = price;
    if (category) product.category = category;
    if (sizes) product.sizes = sizes;
    if (colors) product.colors = colors;
    if (stock !== undefined) product.stock = stock;
    if (status) product.status = status;

    // Handle new image uploads
    if (req.files && req.files.length > 0) {
      const newImages = req.files.map(file => ({
        url: file.path,
        publicId: file.filename,
      }));
      product.images = [...product.images, ...newImages];
    }

    await product.save();

    res.json({
      success: true,
      message: 'Product updated successfully',
      data: product,
    });
  } catch (error) {
    console.error('Update product error:', error);
    res.status(500).json({
      success: false,
      message: 'Server error updating product',
    });
  }
};

// @desc    Delete (soft) product
// @route   DELETE /api/products/brand/:id
// @access  Private (Brand only - own products)
export const deleteProduct = async (req, res) => {
  try {
    const product = await Product.findOne({
      _id: req.params.id,
      brand: req.user._id,
      isDeleted: false,
    });

    if (!product) {
      return res.status(404).json({
        success: false,
        message: 'Product not found',
      });
    }

    // Soft delete
    product.isDeleted = true;
    await product.save();

    res.json({
      success: true,
      message: 'Product deleted successfully',
    });
  } catch (error) {
    console.error('Delete product error:', error);
    res.status(500).json({
      success: false,
      message: 'Server error deleting product',
    });
  }
};

// @desc    Delete product image
// @route   DELETE /api/products/brand/:id/images/:imageId
// @access  Private (Brand only - own products)
export const deleteProductImage = async (req, res) => {
  try {
    const product = await Product.findOne({
      _id: req.params.id,
      brand: req.user._id,
      isDeleted: false,
    });

    if (!product) {
      return res.status(404).json({
        success: false,
        message: 'Product not found',
      });
    }

    product.images = product.images.filter(
      img => img.publicId !== req.params.imageId
    );
    await product.save();

    res.json({
      success: true,
      message: 'Image deleted successfully',
      data: product,
    });
  } catch (error) {
    console.error('Delete product image error:', error);
    res.status(500).json({
      success: false,
      message: 'Server error deleting image',
    });
  }
};

// @desc    Get all published products (marketplace)
// @route   GET /api/products
// @access  Public
export const getMarketplaceProducts = async (req, res) => {
  try {
    const { 
      page = 1, 
      limit = 12, 
      search, 
      category, 
      minPrice, 
      maxPrice, 
      sort = '-createdAt' 
    } = req.query;

    const query = {
      status: 'published',
      isDeleted: false,
    };

    // Search by name
    if (search) {
      query.name = { $regex: search, $options: 'i' };
    }

    // Filter by category
    if (category) {
      query.category = category;
    }

    // Filter by price range
    if (minPrice || maxPrice) {
      query.price = {};
      if (minPrice) query.price.$gte = parseFloat(minPrice);
      if (maxPrice) query.price.$lte = parseFloat(maxPrice);
    }

    const products = await Product.find(query)
      .populate('brand', 'name brandName brandLogo')
      .sort(sort)
      .skip((page - 1) * limit)
      .limit(parseInt(limit));

    const total = await Product.countDocuments(query);

    res.json({
      success: true,
      data: {
        products,
        pagination: {
          page: parseInt(page),
          limit: parseInt(limit),
          total,
          pages: Math.ceil(total / limit),
        },
      },
    });
  } catch (error) {
    console.error('Get marketplace products error:', error);
    res.status(500).json({
      success: false,
      message: 'Server error fetching products',
    });
  }
};

// @desc    Get single product (marketplace)
// @route   GET /api/products/:id
// @access  Public
export const getMarketplaceProduct = async (req, res) => {
  try {
    const product = await Product.findOne({
      _id: req.params.id,
      status: 'published',
      isDeleted: false,
    }).populate('brand', 'name brandName brandLogo');

    if (!product) {
      return res.status(404).json({
        success: false,
        message: 'Product not found',
      });
    }

    res.json({
      success: true,
      data: product,
    });
  } catch (error) {
    console.error('Get marketplace product error:', error);
    res.status(500).json({
      success: false,
      message: 'Server error fetching product',
    });
  }
};

// @desc    Get categories
// @route   GET /api/products/categories
// @access  Public
export const getCategories = async (req, res) => {
  try {
    const categories = [
      { value: 'tops', label: 'Tops' },
      { value: 'bottoms', label: 'Bottoms' },
      { value: 'dresses', label: 'Dresses' },
      { value: 'outerwear', label: 'Outerwear' },
      { value: 'shoes', label: 'Shoes' },
      { value: 'accessories', label: 'Accessories' },
      { value: 'activewear', label: 'Activewear' },
      { value: 'swimwear', label: 'Swimwear' },
      { value: 'formal', label: 'Formal' },
      { value: 'casual', label: 'Casual' },
    ];

    res.json({
      success: true,
      data: categories,
    });
  } catch (error) {
    console.error('Get categories error:', error);
    res.status(500).json({
      success: false,
      message: 'Server error fetching categories',
    });
  }
};
