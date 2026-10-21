const { getOne, query } = require('../config/database');

class BlogRepository {
  async findAll({ search, category, tag, limit } = {}) {
    let sql = 'SELECT * FROM blogs WHERE 1=1';
    const params = [];

    if (search) {
      sql += ' AND (title LIKE ? OR excerpt LIKE ?)';
      params.push(`%${search}%`, `%${search}%`);
    }
    if (category) {
      sql += ' AND category = ?';
      params.push(category);
    }
    if (tag) {
      sql += ' AND JSON_CONTAINS(tags, ?)';
      params.push(JSON.stringify(tag));
    }

    sql += ' ORDER BY publishedAt DESC, createdAt DESC';
    if (limit) {
      sql += ' LIMIT ?';
      params.push(Number(limit));
    }

    return query(sql, params);
  }

  async findById(id) {
    return getOne('SELECT * FROM blogs WHERE id = ?', [id]);
  }

  async findBySlug(slug) {
    return getOne('SELECT * FROM blogs WHERE slug = ?', [slug]);
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
      `INSERT INTO blogs (id, title, slug, excerpt, content, category, tags, authorName, authorRole, authorAvatar, publishedAt, readTime, coverImage, isFeatured)
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
      `UPDATE blogs SET
        title = ?, slug = ?, excerpt = ?, content = ?, category = ?, tags = ?,
        authorName = ?, authorRole = ?, authorAvatar = ?, publishedAt = ?, readTime = ?, coverImage = ?
       WHERE id = ?`,
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
    await query('UPDATE blogs SET isFeatured = ? WHERE id = ?', [newStatus, id]);
    return Boolean(newStatus);
  }

  async delete(id) {
    const res = await query('DELETE FROM blogs WHERE id = ?', [id]);
    return res.affectedRows > 0;
  }
}

module.exports = new BlogRepository();
