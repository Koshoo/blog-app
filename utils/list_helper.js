const _ = require('lodash');
const blogs = [
  {
    _id: '5a422a851b54a676234d17f7',
    title: 'React patterns',
    author: 'Michael Chan',
    url: 'https://reactpatterns.com/',
    likes: 7,
    __v: 0
  },
  {
    _id: '5a422aa71b54a676234d17f8',
    title: 'Go To Statement Considered Harmful',
    author: 'Edsger W. Dijkstra',
    url:
      'http://www.u.arizona.edu/~rubinson/copyright_violations/Go_To_Considered_Harmful.html',
    likes: 5,
    __v: 0
  },
  {
    _id: '5a422b3a1b54a676234d17f9',
    title: 'Canonical string reduction',
    author: 'Edsger W. Dijkstra',
    url: 'http://www.cs.utexas.edu/~EWD/transcriptions/EWD08xx/EWD808.html',
    likes: 12,
    __v: 0
  },
  {
    _id: '5a422b891b54a676234d17fa',
    title: 'First class tests',
    author: 'Robert C. Martin',
    url:
      'http://blog.cleancoder.com/uncle-bob/2017/05/05/TestDefinitions.htmll',
    likes: 10,
    __v: 0
  },
  {
    _id: '5a422ba71b54a676234d17fb',
    title: 'TDD harms architecture',
    author: 'Robert C. Martin',
    url:
      'http://blog.cleancoder.com/uncle-bob/2017/03/03/TDD-Harms-Architecture.html',
    likes: 0,
    __v: 0
  },
  {
    _id: '5a422bc61b54a676234d17fc',
    title: 'Type wars',
    author: 'Robert C. Martin',
    url: 'http://blog.cleancoder.com/uncle-bob/2016/05/01/TypeWars.html',
    likes: 2,
    __v: 0
  }
];
const dummy = () => {
  return 1;
};

const totalLikes = (blogs) => {
  const reducer = (total, blog) => {
    return total + blog.likes;
  };
  return blogs.reduce(reducer, 0);
};

const favoriteBlog = (blogs) => {
  const highestLikedBlog = blogs.reduce((max, blog) =>
    max.likes > blog.likes ? max : blog
  );
  return {
    title: highestLikedBlog.title,
    author: highestLikedBlog.author,
    likes: highestLikedBlog.likes
  };
};

const mostBlogs = (blogs) => {
  const authors = _.countBy(blogs, (blog) => blog.author);

  let maxAuthor = { author: '', blogs: 0 };
  for (let author in authors) {
    if (authors[author] > maxAuthor.blogs) {
      maxAuthor.author = author;
      maxAuthor.blogs = authors[author];
    }
  }
  return maxAuthor;
};

const mostLikes = (blogs) => {
  // Return author with most likes in the form of {author:<name>,likes:<int>}
  const formattedBlogs = [];
  for (let blog of blogs) {
    const existingAuthorBlog = formattedBlogs.find(
      (formattedBlog) => formattedBlog.author === blog.author
    );
    if (existingAuthorBlog) {
      existingAuthorBlog.likes += blog.likes;
    } else {
      formattedBlogs.push({ author: blog.author, likes: blog.likes });
    }
  }

  return formattedBlogs.reduce((prev, blog) => {
    return prev.likes > blog.likes ? prev : blog;
  });
};
console.log(mostBlogs(blogs));
console.log(mostLikes(blogs));

module.exports = { dummy, totalLikes, favoriteBlog };
