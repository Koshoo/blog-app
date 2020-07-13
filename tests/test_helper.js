const Blog = require('../models/blog');

const initialBlogs = [
  {
    title: 'Hello there my name is Ben!',
    author: 'Ben K.',
    url: 'visitme.com',
    likes: 24
  },
  {
    title: 'I am learning web development',
    author: 'Or k',
    url: 'google.com',
    likes: 13
  }
];

const nonExistingId = async () => {
  const blog = new Blog({
    title: 'willbedeletedsoon'
  });

  await blog.save();
  await blog.remove();

  return blog.id.toString();
};

const blogsInDb = async () => {
  const blogs = await Blog.find({});
  return blogs.map((blog) => blog.toJSON());
};

const getValidToken = async (api) => {
  const response = await api
    .post('/api/login')
    .send({ username: 'benkosh', password: '1234' });
  const token = 'Bearer ' + response.body.token;
  return token;
};

module.exports = { initialBlogs, nonExistingId, blogsInDb, getValidToken };
