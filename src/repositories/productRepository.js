const { getOne, query } = require('../config/database');

class ProductRepository {
  async findAll({ category, search, onlyPublished = true } = {}) {
    let sql = 'SELECT * FROM products WHERE 1=1';
    const params = [];

    if (onlyPublished) {
      sql += ' AND isPublished = 1';
    }
    if (category) {
      sql += ' AND category = ?';
      params.push(category);
    }
    if (search) {
      sql += ' AND (name LIKE ? OR tagline LIKE ? OR description LIKE ?)';
      params.push(`%${search}%`, `%${search}%`, `%${search}%`);
    }

    sql += ' ORDER BY createdAt DESC';
    return query(sql, params);
  }

  async findById(id) {
    return getOne('SELECT * FROM products WHERE id = ?', [id]);
  }

  async findBySlug(slug) {
    return getOne('SELECT * FROM products WHERE slug = ?', [slug]);
  }

  async create(product) {
    const {
      id,
      name,
      slug,
      tagline,
      category,
      categoryName,
      basePrice,
      description,
      longDescription,
      techStack,
      featuredBadge,
      mockupType,
    } = product;

    await query(
      `INSERT INTO products (id, name, slug, tagline, category, categoryName, basePrice, description, longDescription, techStack, featuredBadge, mockupType)
       VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)`,
      [
        id,
        name,
        slug,
        tagline,
        category,
        categoryName,
        basePrice,
        description,
        longDescription,
        techStack,
        featuredBadge,
        mockupType,
      ]
    );

    return this.findById(id);
  }

  async update(id, product) {
    const {
      name,
      slug,
      tagline,
      category,
      categoryName,
      basePrice,
      description,
      longDescription,
      techStack,
      featuredBadge,
      mockupType,
    } = product;

    await query(
      `UPDATE products SET
        name = ?, slug = ?, tagline = ?, category = ?, categoryName = ?, basePrice = ?,
        description = ?, longDescription = ?, techStack = ?, featuredBadge = ?, mockupType = ?
       WHERE id = ?`,
      [
        name,
        slug,
        tagline,
        category,
        categoryName,
        basePrice,
        description,
        longDescription,
        techStack,
        featuredBadge,
        mockupType,
        id,
      ]
    );

    return this.findById(id);
  }

  async togglePublish(id, currentStatus) {
    const newStatus = currentStatus ? 0 : 1;
    await query('UPDATE products SET isPublished = ? WHERE id = ?', [newStatus, id]);
    return Boolean(newStatus);
  }

  async delete(id) {
    const res = await query('DELETE FROM products WHERE id = ?', [id]);
    return res.affectedRows > 0;
  }
}

module.exports = new ProductRepository();
