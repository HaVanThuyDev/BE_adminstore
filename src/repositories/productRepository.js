const { getOne, query } = require('../config/database');

const BASE_PRODUCT_SELECT = `
  SELECT 
    p.*,
    COALESCE(ds.CLOUDINARY_URL, p.PREVIEW_IMAGE) AS PREVIEW_IMAGE,
    ds.CLOUDINARY_URL AS CLOUDINARY_URL,
    ds.FILE_NAME AS IMAGE_FILE_NAME
  FROM PRODUCTS p
  LEFT JOIN DATA_SOUSES ds ON p.DATA_SOURCE_ID = ds.ID
`;

class ProductRepository {
  async findAll({ category, search, onlyPublished = true } = {}) {
    let sql = `${BASE_PRODUCT_SELECT} WHERE 1=1`;
    const params = [];

    if (onlyPublished) {
      sql += ' AND p.IS_PUBLISHED = 1';
    }
    if (category) {
      sql += ' AND p.CATEGORY = ?';
      params.push(category);
    }
    if (search) {
      sql += ' AND (p.NAME LIKE ? OR p.TAGLINE LIKE ? OR p.DESCRIPTION LIKE ?)';
      params.push(`%${search}%`, `%${search}%`, `%${search}%`);
    }

    sql += ' ORDER BY p.CREATED_AT DESC';
    return query(sql, params);
  }

  async findById(id) {
    return getOne(`${BASE_PRODUCT_SELECT} WHERE p.ID = ?`, [id]);
  }

  async findBySlug(slug) {
    return getOne(`${BASE_PRODUCT_SELECT} WHERE p.SLUG = ?`, [slug]);
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
