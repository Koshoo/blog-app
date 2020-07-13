const supertest = require('supertest');
const mongoose = require('mongoose');
const helper = require('./test_helper');
const app = require('../app');
const api = supertest(app);

const Blog = require('../models/blog');
const User = require('../models/user');

beforeEach(async () => {
  await Blog.deleteMany({});
  const blogs = helper.initialBlogs;
  await User.deleteMany({});
  await api.post('/api/users').send({
    username: 'benkosh',
    name: 'ben K',
    password: '1234'
  });

  const token = await helper.getValidToken(api);

  for (let blog of blogs) {
    await api.post('/api/blogs').set('Authorization', token).send(blog);
  }
});

describe('when there are initially some blogs in the DB', () => {
  test('return correct amount of blogs in JSON format', async () => {
    const response = await api
      .get('/api/blogs')
      .expect(200)
      .expect('Content-Type', /application\/json/);

    expect(response.body).toHaveLength(helper.initialBlogs.length);
  });

  test('blog posts have got an id property', async () => {
    const blogs = await helper.blogsInDb();
    blogs.forEach((blog) => {
      expect(blog.id).toBeDefined();
    });
  });
});

describe('addition of new note', () => {
  test('cant post a new blog without authorization', async () => {
    const newBlog = new Blog({
      title: 'Hello there...',
      author: 'Rina k',
      url: 'youtube.com',
      likes: 13
    });

    await api.post('/api/blogs').send(newBlog).expect(401);
  });

  test('can post a new blog', async () => {
    const token = await helper.getValidToken(api);

    const newBlog = new Blog({
      title: 'Hello there...',
      author: 'Rina k',
      url: 'youtube.com',
      likes: 13
    });

    await api
      .post('/api/blogs')
      .set('Authorization', token)
      .send(newBlog)
      .expect(201)
      .expect('Content-Type', /application\/json/);

    const blogs = await helper.blogsInDb();
    const titles = blogs.map((blog) => blog.title);

    expect(titles).toContain('Hello there...');
    expect(blogs).toHaveLength(helper.initialBlogs.length + 1);
  });

  test('if likes property is missing, it is set to 0', async () => {
    const token = await helper.getValidToken(api);

    const newBlog = new Blog({
      title: 'Hello there...',
      author: 'Rina k',
      url: 'youtube.com'
    });

    const response = await api
      .post('/api/blogs')
      .set('Authorization', token)
      .send(newBlog)
      .expect(201);
    const blog = response.body;
    expect(blog.likes).toBe(0);
  });

  test('if title and url are missing return 400 bad request', async () => {
    const token = await helper.getValidToken(api);
    const newBlog = new Blog({});
    await api
      .post('/api/blogs')
      .set('Authorization', token)
      .send(newBlog)
      .expect(400);
  });
});

describe('deleting a note', () => {
  test('can delete a note', async () => {
    const token = await helper.getValidToken(api);
    const startingBlogs = await helper.blogsInDb();
    const noteToDelete = startingBlogs[0];
    await api
      .delete(`/api/blogs/${noteToDelete.id}`)
      .set('Authorization', token)
      .expect(204);
    const blogsAtEnd = await helper.blogsInDb();

    expect(blogsAtEnd).toHaveLength(startingBlogs.length - 1);
  });
});

afterAll(() => {
  mongoose.connection.close();
});
