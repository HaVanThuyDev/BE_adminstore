const blogRepository = require('../repositories/blogRepository');
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

class BlogService {
  async getAllBlogs(query = {}) {
    const rows = await blogRepository.findAll(query);
    return rows.map((r) => ({
      ...r,
      tags: parseJsonSafe(r.tags, []),
      isFeatured: Boolean(r.isFeatured),
      author: {
        name: r.authorName,
        role: r.authorRole,
        avatar: r.authorAvatar,
      },
    }));
  }

  async getBlogBySlug(slug) {
    const blog = await blogRepository.findBySlug(slug);
    if (!blog) {
      throw new Error('Không tìm thấy bài viết');
    }
    return {
      ...blog,
      tags: parseJsonSafe(blog.tags, []),
      isFeatured: Boolean(blog.isFeatured),
      author: {
        name: blog.authorName,
        role: blog.authorRole,
        avatar: blog.authorAvatar,
      },
    };
  }

  async createBlog(data) {
    const finalSlug = data.slug || slugify(data.title);
    const existing = await blogRepository.findBySlug(finalSlug);
    if (existing) {
      throw new Error('Đường dẫn (slug) bài viết đã tồn tại');
    }

    const tagsJson = JSON.stringify(
      Array.isArray(data.tags)
        ? data.tags
        : (data.tags || '').split(',').map((t) => t.trim()).filter(Boolean)
    );

    const blog = {
      id: `blog-${Date.now()}`,
      title: data.title,
      slug: finalSlug,
      excerpt: data.excerpt || '',
      content: data.content,
      category: data.category || 'Chuyển đổi số',
      tags: tagsJson,
      authorName: data.authorName || '2HT Technology',
      authorRole: data.authorRole || 'Chuyên gia giải pháp',
      authorAvatar: data.authorAvatar || 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=200&q=80',
      publishedAt: data.publishedAt || new Date().toISOString().split('T')[0],
      readTime: data.readTime || '5 phút đọc',
      coverImage: data.coverImage || 'https://images.unsplash.com/photo-1451187580459-43490279c0fa?auto=format&fit=crop&w=1200&q=80',
      isFeatured: Boolean(data.isFeatured),
    };

    return blogRepository.create(blog);
  }

  async updateBlog(id, data) {
    const existing = await blogRepository.findById(id);
    if (!existing) {
      throw new Error('Không tìm thấy bài viết để cập nhật');
    }

    const finalSlug = data.slug || existing.slug;
    const tagsJson = JSON.stringify(
      Array.isArray(data.tags)
        ? data.tags
        : (data.tags || existing.tags).split(',').map((t) => t.trim()).filter(Boolean)
    );

    const updatedBlog = {
      title: data.title || existing.title,
      slug: finalSlug,
      excerpt: data.excerpt !== undefined ? data.excerpt : existing.excerpt,
      content: data.content || existing.content,
      category: data.category || existing.category,
      tags: tagsJson,
      authorName: data.authorName || existing.authorName,
      authorRole: data.authorRole || existing.authorRole,
      authorAvatar: data.authorAvatar || existing.authorAvatar,
      publishedAt: data.publishedAt || existing.publishedAt,
      readTime: data.readTime || existing.readTime,
      coverImage: data.coverImage || existing.coverImage,
    };

    return blogRepository.update(id, updatedBlog);
  }

  async toggleFeatured(id) {
    const blog = await blogRepository.findById(id);
    if (!blog) {
      throw new Error('Không tìm thấy bài viết');
    }
    const newStatus = await blogRepository.toggleFeatured(id, blog.isFeatured);
    return { isFeatured: newStatus };
  }

  async deleteBlog(id) {
    const success = await blogRepository.delete(id);
    if (!success) {
      throw new Error('Không tìm thấy bài viết để xóa');
    }
    return true;
  }
}

module.exports = new BlogService();
