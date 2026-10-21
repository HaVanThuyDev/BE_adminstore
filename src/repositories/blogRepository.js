const { getOne, query } = require('../config/database');

class BlogRepository {
  async findAll({ search, category, tag, limit } = {}) {
    let sql = 'SELECT * FROM BLOGS WHERE 1=1';
    const params = [];

    if (search) {
      sql += ' AND (TITLE LIKE ? OR EXCERPT LIKE ?)';
      params.push(`%${search}%`, `%${search}%`);
    }
    if (category) {
      sql += ' AND CATEGORY = ?';
      params.push(category);
    }
    if (tag) {
      sql += ' AND JSON_CONTAINS(TAGS, ?)';
      params.push(JSON.stringify(tag));
    }

    sql += ' ORDER BY PUBLISHED_AT DESC, CREATED_AT DESC';
    if (limit) {
      sql += ' LIMIT ?';
      params.push(Number(limit));
    }

    return query(sql, params);
  }

  async findById(id) {
    return getOne('SELECT * FROM BLOGS WHERE ID = ?', [id]);
  }

  async findBySlug(slug) {
    return getOne('SELECT * FROM BLOGS WHERE SLUG = ?', [slug]);
  }

  async create(blog) {
    const {
      id,
      title,
      slug,
      excerpt,
      content,
      category,
      tags,
      authorName,
      authorRole,
      authorAvatar,
      publishedAt,
      readTime,
      coverImage,
      isFeatured,
    } = blog;

    await query(
      `INSERT INTO BLOGS (ID, TITLE, SLUG, EXCERPT, CONTENT, CATEGORY, TAGS, AUTHOR_NAME, AUTHOR_ROLE, AUTHOR_AVATAR, PUBLISHED_AT, READ_TIME, COVER_IMAGE, IS_FEATURED)
       VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)`,
      [
        id,
        title,
        slug,
        excerpt,
        content,
        category,
        tags,
        authorName,
        authorRole,
        authorAvatar,
        publishedAt,
        readTime,
        coverImage,
        isFeatured ? 1 : 0,
      ]
    );

    return this.findById(id);
  }

  async update(id, blog) {
    const {
      title,
      slug,
      excerpt,
      content,
      category,
      tags,
      authorName,
      authorRole,
      authorAvatar,
      publishedAt,
      readTime,
      coverImage,
    } = blog;

    await query(
      `UPDATE BLOGS SET
        TITLE = ?, SLUG = ?, EXCERPT = ?, CONTENT = ?, CATEGORY = ?, TAGS = ?,
        AUTHOR_NAME = ?, AUTHOR_ROLE = ?, AUTHOR_AVATAR = ?, PUBLISHED_AT = ?, READ_TIME = ?, COVER_IMAGE = ?
       WHERE ID = ?`,
      [
        title,
        slug,
        excerpt,
        content,
        category,
        tags,
        authorName,
        authorRole,
        authorAvatar,
        publishedAt,
        readTime,
        coverImage,
        id,
      ]
    );

    return this.findById(id);
  }

  async toggleFeatured(id, currentStatus) {
    const newStatus = currentStatus ? 0 : 1;
    await query('UPDATE BLOGS SET IS_FEATURED = ? WHERE ID = ?', [newStatus, id]);
    return Boolean(newStatus);
  }

  async delete(id) {
    const res = await query('DELETE FROM BLOGS WHERE ID = ?', [id]);
    return res.affectedRows > 0;
  }
}

module.exports = new BlogRepository();
