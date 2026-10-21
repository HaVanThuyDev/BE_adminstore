const productRepository = require('../repositories/productRepository');
const { slugify } = require('../utils/helpers');

const parseJsonSafe = (val, defaultVal = []) => {
  if (Array.isArray(val)) return val;
  if (typeof val === 'object' && val !== null) return val;
  if (typeof val === 'string') {
    try {
      return JSON.parse(val);
    } catch {
      return defaultVal;
    }
  }
  return defaultVal;
};

class ProductService {
  async getAllProducts(query = {}) {
    const onlyPublished = query.all !== 'true';
    const rows = await productRepository.findAll({
      category: query.category,
      search: query.search,
      onlyPublished,
    });

    return rows.map((p) => ({
      ...p,
      basePrice: Number(p.basePrice) || 0,
      techStack: parseJsonSafe(p.techStack, []),
      hasLiveDemo: Boolean(p.hasLiveDemo),
      isPublished: Boolean(p.isPublished),
    }));
  }

  async getProductBySlug(slug) {
    const product = await productRepository.findBySlug(slug);
    if (!product) {
      throw new Error('Không tìm thấy sản phẩm phần mềm');
    }
    return {
      ...product,
      basePrice: Number(product.basePrice) || 0,
      techStack: parseJsonSafe(product.techStack, []),
      hasLiveDemo: Boolean(product.hasLiveDemo),
      isPublished: Boolean(product.isPublished),
    };
  }

  async createProduct(data) {
    const finalSlug = data.slug || slugify(data.name);
    const existing = await productRepository.findBySlug(finalSlug);
    if (existing) {
      throw new Error('Đường dẫn (slug) sản phẩm đã tồn tại');
    }

    const categoryNames = {
      ecommerce: 'Thương mại điện tử',
      management: 'Phần mềm quản lý',
      website: 'Website Doanh nghiệp',
      finance: 'Tài chính',
      hrm: 'Nhân sự',
      custom: 'Giải pháp theo yêu cầu',
    };

    const techs = JSON.stringify(
      Array.isArray(data.techStack)
        ? data.techStack
        : (data.techStack || '').split(',').map((t) => t.trim()).filter(Boolean)
    );

    const product = {
      id: `prod-${Date.now()}`,
      name: data.name,
      slug: finalSlug,
      tagline: data.tagline || '',
      category: data.category || 'ecommerce',
      categoryName: data.categoryName || categoryNames[data.category] || 'Giải pháp',
      basePrice: Number(data.basePrice) || 0,
      description: data.description || '',
      longDescription: data.longDescription || data.description || '',
      techStack: techs,
      featuredBadge: data.featuredBadge || null,
      mockupType: data.mockupType || 'business',
      previewImage: data.previewImage || null,
      dataSourceId: data.dataSourceId || null,
    };

    return productRepository.create(product);
  }

  async updateProduct(id, data) {
    const existing = await productRepository.findById(id);
    if (!existing) {
      throw new Error('Không tìm thấy sản phẩm để cập nhật');
    }

    const finalSlug = data.slug || existing.slug;
    const techs = JSON.stringify(
      Array.isArray(data.techStack)
        ? data.techStack
        : (data.techStack || existing.techStack).split(',').map((t) => t.trim()).filter(Boolean)
    );

    const updatedProduct = {
      name: data.name || existing.name,
      slug: finalSlug,
      tagline: data.tagline !== undefined ? data.tagline : existing.tagline,
      category: data.category || existing.category,
      categoryName: data.categoryName || existing.categoryName,
      basePrice: data.basePrice !== undefined ? Number(data.basePrice) : existing.basePrice,
      description: data.description !== undefined ? data.description : existing.description,
      longDescription: data.longDescription !== undefined ? data.longDescription : existing.longDescription,
      techStack: techs,
      featuredBadge: data.featuredBadge !== undefined ? data.featuredBadge : existing.featuredBadge,
      mockupType: data.mockupType || existing.mockupType,
      previewImage: data.previewImage !== undefined ? data.previewImage : existing.previewImage,
      dataSourceId: data.dataSourceId !== undefined ? data.dataSourceId : existing.dataSourceId,
    };

    return productRepository.update(id, updatedProduct);
  }

  async togglePublish(id) {
    const product = await productRepository.findById(id);
    if (!product) {
      throw new Error('Không tìm thấy sản phẩm');
    }
    const newStatus = await productRepository.togglePublish(id, product.isPublished);
    return { isPublished: newStatus };
  }

  async deleteProduct(id) {
    const success = await productRepository.delete(id);
    if (!success) {
      throw new Error('Không tìm thấy sản phẩm để xóa');
    }
    return true;
  }
}

module.exports = new ProductService();
