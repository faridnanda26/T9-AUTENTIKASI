
import { prisma } from '../src/lib/prisma.js';

const NAMA_PRODUK = [
  'Indomie Goreng',
  'Aqua 600ml',
  'Chitato',
  'Teh Pucuk',
  'Roti Cokelat',
  'Kopi Susu',
  'SilverQueen',
  'Mie Sedaap',
];

const KATEGORI = ['MAKANAN', 'MINUMAN', 'CEMILAN'];

async function main() {
  // Kosongkan tabel anak terlebih dahulu
  await prisma.order.deleteMany();
  await prisma.productReview.deleteMany();
  await prisma.product.deleteMany();

  // Seed Product
  await prisma.product.createMany({
    data: [
      {
        id: 1,
        name: 'Indomie Goreng',
        category: 'MAKANAN',
        price: 3500,
        stock: 100,
      },
      {
        id: 2,
        name: 'Aqua 600ml',
        category: 'MINUMAN',
        price: 4000,
        stock: 80,
      },
      {
        id: 3,
        name: 'Chitato',
        category: 'CEMILAN',
        price: 12000,
        stock: 50,
      },

      // ID 4-25 dibuat dengan perulangan
      ...Array.from({ length: 22 }, (_, k) => {
        const i = k + 4;

        return {
          id: i,
          name: `${NAMA_PRODUK[i % 8]} ${i}`,
          category: KATEGORI[i % 3],
          price: (5000 + (i % 10) * 2000),
          stock: 20 + (i % 10) * 5,
        };
      }),
    ],
  });

  // Seed ProductReview
  await prisma.productReview.createMany({
    data: [
      {
        id: 1,
        reviewer: 'Andi',
        comment: 'Produk bagus dan berkualitas',
        rating: 5,
        productId: 1,
      },
      {
        id: 2,
        reviewer: 'Budi',
        comment: 'Rasanya enak dan harganya terjangkau',
        rating: 4,
        productId: 1,
      },
      {
        id: 3,
        reviewer: 'Citra',
        comment: 'Produk sesuai dengan deskripsi',
        rating: 5,
        productId: 2,
      },
      {
        id: 4,
        reviewer: 'Dewi',
        comment: 'Kualitas cukup baik',
        rating: 3,
        productId: 3,
      },

      // Review tambahan untuk produk ID 4-25
      ...Array.from({ length: 22 }, (_, k) => {
        const i = k + 4;

        return {
          id: i + 1,
          reviewer: NAMA_PRODUK[i % 8],
          comment: `Ulasan untuk produk nomor ${i}`,
          rating: 3 + (i % 3),
          productId: i,
        };
      }),
    ],
  });

  // Seed Order
  await prisma.order.createMany({
    data: [
      {
        id: 1,
        quantity: 2,
        total: 7000,
        productId: 1,
      },
      {
        id: 2,
        quantity: 3,
        total: 12000,
        productId: 2,
      },
      {
        id: 3,
        quantity: 1,
        total: 12000,
        productId: 3,
      },

      // Order tambahan untuk produk ID 4-25
      ...Array.from({ length: 22 }, (_, k) => {
        const i = k + 4;
        const quantity = 1 + (i % 5);
        const price = 5000 + (i % 10) * 2000;

        return {
          id: i + 1,
          quantity,
          total: price * quantity,
          productId: i,
        };
      }),
    ],
  });

  console.log('Seed berhasil dijalankan!');
  console.log('25 produk berhasil ditambahkan.');
  console.log('26 ulasan berhasil ditambahkan.');
  console.log('25 pesanan berhasil ditambahkan.');
}

main()
  .catch((err) => {
    console.error('Seed gagal:', err);
    process.exitCode = 1;
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
