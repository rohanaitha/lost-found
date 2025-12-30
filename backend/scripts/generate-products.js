import fs from "fs";
import path from "path";
import { faker } from "@faker-js/faker";

// Usage: node scripts/generate-products.js [count]
const count = Number(process.argv[2]) || 80;
const outDir = path.resolve(process.cwd(), "data");
if (!fs.existsSync(outDir)) fs.mkdirSync(outDir, { recursive: true });

function generateProducts(n, seed) {
  if (seed !== undefined) faker.seed(seed);
  const categories = new Array(10).fill(0).map((_, i) => ({
    id: `cat_${i + 1}`,
    name: faker.commerce.department(),
    slug: faker.helpers.slugify(faker.commerce.department()).toLowerCase(),
  }));

  const products = new Array(n).fill(0).map((_, i) => {
    const title = faker.commerce.productName();
    const price = Number(faker.commerce.price(5, 500, 2));
    const onSale = faker.datatype.boolean() && faker.datatype.boolean();
    const salePrice = onSale
      ? Number((price * (0.6 + Math.random() * 0.35)).toFixed(2))
      : null;
    return {
      id: `prod_${i + 1}`,
      title,
      slug: faker.helpers.slugify(title).toLowerCase(),
      description: faker.commerce.productDescription(),
      price,
      salePrice,
      currency: "USD",
      categoryId: `cat_${faker.datatype.number({
        min: 1,
        max: categories.length,
      })}`,
      images: [faker.image.urlLoremFlickr({ category: "product" })],
      sku: faker.string.alphanumeric(8).toUpperCase(),
      stock: faker.datatype.number({ min: 0, max: 1000 }),
      rating: Number((1 + Math.random() * 4).toFixed(2)),
      reviewsCount: faker.datatype.number({ min: 0, max: 2000 }),
      createdAt: faker.date.past().toISOString(),
    };
  });

  return { categories, products };
}

const data = generateProducts(count, 42);
const outPath = path.join(outDir, "products.json");
fs.writeFileSync(outPath, JSON.stringify(data, null, 2), "utf8");
console.log(`Wrote ${count} products to ${outPath}`);
