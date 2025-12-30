import fs from "fs";
import path from "path";
import { faker } from "@faker-js/faker";

const dataPath = path.resolve(process.cwd(), "data", "products.json");

function generateProducts(n = 80, seed = 42) {
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

export async function getProducts(req, res) {
  try {
    // prefer existing file
    if (fs.existsSync(dataPath)) {
      const raw = fs.readFileSync(dataPath, "utf8");
      const parsed = JSON.parse(raw);
      return res.json(parsed.products ?? parsed);
    }

    const count = Number(req.query.count) || 80;
    const seed = req.query.seed ? Number(req.query.seed) : undefined;
    const generated = generateProducts(count, seed);

    // ensure dir
    const dir = path.dirname(dataPath);
    if (!fs.existsSync(dir)) fs.mkdirSync(dir, { recursive: true });
    fs.writeFileSync(dataPath, JSON.stringify(generated, null, 2), "utf8");

    return res.json(generated.products);
  } catch (err) {
    console.error("StoreController.getProducts error", err);
    return res.status(500).json({ error: "failed to load products" });
  }
}

export async function regenerateProducts(req, res) {
  try {
    const count = Number(req.body.count) || 80;
    const seed = req.body.seed ? Number(req.body.seed) : undefined;
    const generated = generateProducts(count, seed);
    const dir = path.dirname(dataPath);
    if (!fs.existsSync(dir)) fs.mkdirSync(dir, { recursive: true });
    fs.writeFileSync(dataPath, JSON.stringify(generated, null, 2), "utf8");
    return res.json({ ok: true, products: generated.products.length });
  } catch (err) {
    console.error("StoreController.regenerateProducts error", err);
    return res.status(500).json({ error: "failed to regenerate products" });
  }
}

export async function getProductById(req, res) {
  try {
    const id = req.params.id;
    if (!id) return res.status(400).json({ error: "product id required" });

    if (fs.existsSync(dataPath)) {
      const raw = fs.readFileSync(dataPath, "utf8");
      const parsed = JSON.parse(raw);
      const products = parsed.products || parsed;
      const found = products.find((p) => p.id === id);
      if (!found) return res.status(404).json({ error: "not found" });
      return res.json(found);
    }

    // fallback - generate and search
    const generated = generateProducts(80, 42);
    const found = generated.products.find((p) => p.id === id);
    if (!found) return res.status(404).json({ error: "not found" });
    return res.json(found);
  } catch (err) {
    console.error("getProductById error", err);
    return res.status(500).json({ error: "internal" });
  }
}
