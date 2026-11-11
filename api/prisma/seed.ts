import { PrismaClient } from '@prisma/client';
import { hash } from 'bcryptjs';

const prisma = new PrismaClient();

async function main() {
  await prisma.booking.deleteMany();
  await prisma.borrowRequest.deleteMany();
  await prisma.space.deleteMany();
  await prisma.review.deleteMany();
  await prisma.book.deleteMany();
  await prisma.genre.deleteMany();
  await prisma.user.deleteMany();

  const seedPassword = process.env.SEED_USER_PASSWORD;
  if (!seedPassword || seedPassword.length < 12) {
    throw new Error('SEED_USER_PASSWORD must be set and at least 12 characters long');
  }
  const seedPasswordHash = await hash(seedPassword, 12);
  const librarian = await prisma.user.create({
    data: {
      email: 'librarian@library.com',
      name: 'Head Librarian',
      passwordHash: seedPasswordHash,
      role: 'LIBRARIAN',
    },
  });

  const patron = await prisma.user.create({
    data: {
      email: 'patron@library.com',
      name: 'Book Lover',
      passwordHash: seedPasswordHash,
      role: 'PATRON',
    },
  });

  const fantasy = await prisma.genre.create({ data: { name: 'Fantasy' } });
  const sciFi = await prisma.genre.create({ data: { name: 'Science Fiction' } });
  const mystery = await prisma.genre.create({ data: { name: 'Mystery' } });
  const nonFiction = await prisma.genre.create({ data: { name: 'Non-Fiction' } });
  await prisma.space.createMany({
    data: [
      { name: 'Focus Booth', capacity: 1 },
      { name: 'Study Room', capacity: 6 },
      { name: 'Community Table', capacity: 8 },
      { name: 'Presentation Room', capacity: 12 },
    ],
  });

  const booksData = [
    { title: 'The Hobbit', author: 'J.R.R. Tolkien', isbn: '978-0547928227', publishedYear: 1937, totalCopies: 4, genreId: fantasy.id },
    { title: 'The Fellowship of the Ring', author: 'J.R.R. Tolkien', isbn: '978-0618346257', publishedYear: 1954, totalCopies: 3, genreId: fantasy.id },
    { title: 'A Game of Thrones', author: 'George R.R. Martin', isbn: '978-0553103540', publishedYear: 1996, totalCopies: 2, genreId: fantasy.id },
    { title: 'The Name of the Wind', author: 'Patrick Rothfuss', isbn: '978-0756404749', publishedYear: 2007, totalCopies: 2, genreId: fantasy.id },
    { title: 'Dune', author: 'Frank Herbert', isbn: '978-0441172719', publishedYear: 1965, totalCopies: 5, genreId: sciFi.id },
    { title: 'Neuromancer', author: 'William Gibson', isbn: '978-0441569595', publishedYear: 1984, totalCopies: 2, genreId: sciFi.id },
    { title: 'Foundation', author: 'Isaac Asimov', isbn: '978-0553293357', publishedYear: 1951, totalCopies: 3, genreId: sciFi.id },
    { title: 'The Martian', author: 'Andy Weir', isbn: '978-0804139021', publishedYear: 2011, totalCopies: 3, genreId: sciFi.id },
    { title: 'The Hound of the Baskervilles', author: 'Arthur Conan Doyle', isbn: '978-0140437867', publishedYear: 1902, totalCopies: 2, genreId: mystery.id },
    { title: 'And Then There Were None', author: 'Agatha Christie', isbn: '978-0062073488', publishedYear: 1939, totalCopies: 4, genreId: mystery.id },
    { title: 'The Girl with the Dragon Tattoo', author: 'Stieg Larsson', isbn: '978-0307454546', publishedYear: 2005, totalCopies: 2, genreId: mystery.id },
    { title: 'Gone Girl', author: 'Gillian Flynn', isbn: '978-0307588372', publishedYear: 2012, totalCopies: 2, genreId: mystery.id },
    { title: 'Sapiens: A Brief History of Humankind', author: 'Yuval Noah Harari', isbn: '978-0062316097', publishedYear: 2011, totalCopies: 3, genreId: nonFiction.id },
    { title: 'Educated', author: 'Tara Westover', isbn: '978-0399590504', publishedYear: 2018, totalCopies: 2, genreId: nonFiction.id },
    { title: 'Atomic Habits', author: 'James Clear', isbn: '978-0735211292', publishedYear: 2018, totalCopies: 4, genreId: nonFiction.id },
  ];

  for (const book of booksData) {
    const createdBook = await prisma.book.create({ data: book });
    
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

  console.log(`Seeded ${booksData.length} books, 4 genres, and 2 users.`);
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });