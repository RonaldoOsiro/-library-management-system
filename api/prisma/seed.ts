import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

async function main() {
  // Clean existing data for a fresh seed run
  await prisma.review.deleteMany();
  await prisma.book.deleteMany();
  await prisma.genre.deleteMany();
  await prisma.user.deleteMany();

  // Create Users
  const librarian = await prisma.user.create({
    data: {
      email: 'librarian@library.com',
      name: 'Head Librarian',
      role: 'LIBRARIAN',
    },
  });

  const patron = await prisma.user.create({
    data: {
      email: 'patron@library.com',
      name: 'Book Lover',
      role: 'PATRON',
    },
  });

  // Create 4 Genres
  const fantasy = await prisma.genre.create({ data: { name: 'Fantasy' } });
  const sciFi = await prisma.genre.create({ data: { name: 'Science Fiction' } });
  const mystery = await prisma.genre.create({ data: { name: 'Mystery' } });
  const nonFiction = await prisma.genre.create({ data: { name: 'Non-Fiction' } });

  // Create 15 Books distributed across genres
  const booksData = [
    // Fantasy (4 books)
    { title: 'The Hobbit', author: 'J.R.R. Tolkien', isbn: '978-0547928227', publishedYear: 1937, genreId: fantasy.id },
    { title: 'The Fellowship of the Ring', author: 'J.R.R. Tolkien', isbn: '978-0618346257', publishedYear: 1954, genreId: fantasy.id },
    { title: 'A Game of Thrones', author: 'George R.R. Martin', isbn: '978-0553103540', publishedYear: 1996, genreId: fantasy.id },
    { title: 'The Name of the Wind', author: 'Patrick Rothfuss', isbn: '978-0756404749', publishedYear: 2007, genreId: fantasy.id },

    // Science Fiction (4 books)
    { title: 'Dune', author: 'Frank Herbert', isbn: '978-0441172719', publishedYear: 1965, genreId: sciFi.id },
    { title: 'Neuromancer', author: 'William Gibson', isbn: '978-0441569595', publishedYear: 1984, genreId: sciFi.id },
    { title: 'Foundation', author: 'Isaac Asimov', isbn: '978-0553293357', publishedYear: 1951, genreId: sciFi.id },
    { title: 'The Martian', author: 'Andy Weir', isbn: '978-0804139021', publishedYear: 2011, genreId: sciFi.id },

    // Mystery (4 books)
    { title: 'The Hound of the Baskervilles', author: 'Arthur Conan Doyle', isbn: '978-0140437867', publishedYear: 1902, genreId: mystery.id },
    { title: 'And Then There Were None', author: 'Agatha Christie', isbn: '978-0062073488', publishedYear: 1939, genreId: mystery.id },
    { title: 'The Girl with the Dragon Tattoo', author: 'Stieg Larsson', isbn: '978-0307454546', publishedYear: 2005, genreId: mystery.id },
    { title: 'Gone Girl', author: 'Gillian Flynn', isbn: '978-0307588372', publishedYear: 2012, genreId: mystery.id },

    // Non-Fiction (3 books)
    { title: 'Sapiens: A Brief History of Humankind', author: 'Yuval Noah Harari', isbn: '978-0062316097', publishedYear: 2011, genreId: nonFiction.id },
    { title: 'Educated', author: 'Tara Westover', isbn: '978-0399590504', publishedYear: 2018, genreId: nonFiction.id },
    { title: 'Atomic Habits', author: 'James Clear', isbn: '978-0735211292', publishedYear: 2018, genreId: nonFiction.id },
  ];

  for (const book of booksData) {
    const createdBook = await prisma.book.create({ data: book });
    
    // Seed sample reviews for stretch goals
    if (book.title === 'Dune' || book.title === 'The Hobbit') {
      await prisma.review.create({
        data: {
          rating: 5,
          comment: 'An absolute masterpiece of its genre!',
          bookId: createdBook.id,
          userId: patron.id,
        },
      });
    }
  }

  console.log('Database seeded successfully with genres, books, users, and reviews!');
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });