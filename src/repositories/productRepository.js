const { getOne, query } = require('../config/database');

class ProductRepository {
  async findAll({ category, search, onlyPublished = true } = {}) {
    let sql = 'SELECT * FROM PRODUCTS WHERE 1=1';
    const params = [];

    if (onlyPublished) {
      sql += ' AND IS_PUBLISHED = 1';
    }
    if (category) {
      sql += ' AND CATEGORY = ?';
      params.push(category);
    }
    if (search) {
      sql += ' AND (NAME LIKE ? OR TAGLINE LIKE ? OR DESCRIPTION LIKE ?)';
      params.push(`%${search}%`, `%${search}%`, `%${search}%`);
    }

    sql += ' ORDER BY CREATED_AT DESC';
    return query(sql, params);
  }

  async findById(id) {
    return getOne('SELECT * FROM PRODUCTS WHERE ID = ?', [id]);
  }

  async findBySlug(slug) {
    return getOne('SELECT * FROM PRODUCTS WHERE SLUG = ?', [slug]);
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
      previewImage,
      dataSourceId,
    } = product;

    await query(
      `INSERT INTO PRODUCTS (ID, NAME, SLUG, TAGLINE, CATEGORY, CATEGORY_NAME, BASE_PRICE, DESCRIPTION, LONG_DESCRIPTION, TECH_STACK, FEATURED_BADGE, MOCKUP_TYPE, PREVIEW_IMAGE, DATA_SOURCE_ID)
       VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)`,
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
        previewImage || null,
        dataSourceId || null,
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
      previewImage,
      dataSourceId,
    } = product;

    await query(
      `UPDATE PRODUCTS SET
        NAME = ?, SLUG = ?, TAGLINE = ?, CATEGORY = ?, CATEGORY_NAME = ?, BASE_PRICE = ?,
        DESCRIPTION = ?, LONG_DESCRIPTION = ?, TECH_STACK = ?, FEATURED_BADGE = ?, MOCKUP_TYPE = ?,
        PREVIEW_IMAGE = COALESCE(?, PREVIEW_IMAGE), DATA_SOURCE_ID = COALESCE(?, DATA_SOURCE_ID)
       WHERE ID = ?`,
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
        previewImage,
        dataSourceId,
        id,
      ]
    );

    return this.findById(id);
  }

  async togglePublish(id, currentStatus) {
    const newStatus = currentStatus ? 0 : 1;
    await query('UPDATE PRODUCTS SET IS_PUBLISHED = ? WHERE ID = ?', [newStatus, id]);
    return Boolean(newStatus);
  }

  async delete(id) {
    const res = await query('DELETE FROM PRODUCTS WHERE ID = ?', [id]);
    return res.affectedRows > 0;
  }
}

module.exports = new ProductRepository();
