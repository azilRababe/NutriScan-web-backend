import axios from "axios";

/**
 * Fetch from multiple OFF endpoints and compute Yuka-like score & rating.
 * Returns the product object extended with: { yukaScore, yukaRating, _sourceName }
 */
export const fetchProductData = async (barcode) => {
  try {
    const sources = [
      {
        name: "food",
        url: `https://world.openfoodfacts.org/api/v3/product/${barcode}.json`,
      },
      {
        name: "beauty",
        url: `https://world.openbeautyfacts.org/api/v3/product/${barcode}.json`,
      },
      {
        name: "product",
        url: `https://world.openproductsfacts.org/api/v3/product/${barcode}.json`,
      },
      {
        name: "pet",
        url: `https://world.openpetfoodfacts.org/api/v3/product/${barcode}.json`,
      },
    ];

    const results = await Promise.allSettled(
      sources.map((s) => axios.get(s.url))
    );

    // find first fulfilled with a product
    const foundIndex = results.findIndex(
      (r) => r.status === "fulfilled" && r.value?.data?.product
    );
    if (foundIndex === -1) throw new Error("No product found");

    const sourceName = sources[foundIndex].name;
    const product = results[foundIndex].value.data.product;

    // compute score using appropriate system
    let score = 0;
    // let rating = null;

    if (sourceName === "beauty") {
      score = calculateBeautyScore(product);
      // rating = getRating(score, "beauty");
    } else {
      score = calculateFoodScore(product);
      // rating = getRating(score, "food");
    }

    console.log(`coming from fetchdata function: ${score} `);
    return {
      ...product,
      Score: score,
      // Rating: rating,
      _sourceName: sourceName,
    };
  } catch (error) {
    console.error(error);
    return null;
  }
};

// -----------------
// Helpers: normalize strings
// -----------------
const includesAny = (str = "", arr = []) => {
  if (!str) return false;
  const s = str.toLowerCase();
  return arr.some((a) => s.includes(a.toLowerCase()));
};

const arrayIncludesAny = (arr = [], needles = []) => {
  if (!Array.isArray(arr)) return false;
  return arr.some((a) =>
    needles.some((n) => String(a).toLowerCase().includes(n.toLowerCase()))
  );
};

// -----------------
// FOOD SCORING (improved)
// -----------------
const calculateFoodScore = (product) => {
  if (!product) return 0;

  const nutriments = product.nutriments || {};
  const sugar = Number(nutriments.sugars_100g ?? 0);
  const salt = Number(nutriments.salt_100g ?? 0);
  const satFat = Number(nutriments["saturated-fat_100g"] ?? 0);
  const energy = Number(
    nutriments["energy-kcal_100g"] ?? nutriments.energy_100g / 4.184 ?? 0
  );
  const fiber = Number(nutriments.fiber_100g ?? 0);
  const protein = Number(nutriments.proteins_100g ?? 0);

  const additives = Number(product.additives_n ?? 0);
  const nova = Number(product.nova_group ?? 0);
  const labels = product.labels_tags || [];
  const categories = (product.categories_tags || []).join(" ").toLowerCase();
  const name = (product.product_name || "").toLowerCase();

  // ---------- 1️⃣ Handle ultra-low-nutriment products (water / plain coffee / tea)
  const looksLikeWater = /\b(water|eau|mineral|source)\b/i.test(
    name + categories
  );
  const looksLikePlainDrink = /\b(tea|coffee|infusion)\b/i.test(
    name + categories
  );

  const isZeroEnergy = energy < 3 && sugar < 0.5 && salt < 0.05 && satFat < 0.5;

  if (looksLikeWater && isZeroEnergy && additives === 0) return 99;
  if (looksLikePlainDrink && isZeroEnergy && additives === 0) return 92;

  // ---------- 2️⃣ Base NutriScore (A–E) if available
  const nutriMap = { a: 85, b: 70, c: 50, d: 30, e: 10 };
  let nutriComponent =
    nutriMap[String(product.nutriscore_grade || "").toLowerCase()] ?? null;

  // ---------- 3️⃣ If no NutriScore, infer it from nutrition
  if (nutriComponent === null) {
    // Penalty estimation
    const energyPenalty = Math.min(25, Math.max(0, energy / 30)); // 30 kcal = 1pt
    const sugarPenalty =
      sugar <= 1 ? 0 : sugar <= 5 ? 4 : sugar <= 10 ? 8 : sugar <= 20 ? 15 : 25;
    const fatPenalty =
      satFat <= 1 ? 0 : satFat <= 3 ? 5 : satFat <= 6 ? 10 : 20;
    const saltPenalty = salt <= 0.1 ? 0 : salt <= 0.5 ? 4 : salt <= 1 ? 8 : 15;

    const negative = Math.min(
      70,
      energyPenalty + sugarPenalty + fatPenalty + saltPenalty
    );

    // Baseline 85 minus penalties, plus fiber/protein bonus
    nutriComponent = Math.max(
      0,
      85 -
        negative +
        (fiber >= 3 ? 3 : fiber >= 1.5 ? 1 : 0) +
        (protein >= 8 ? 3 : protein >= 4 ? 1 : 0)
    );
  }

  // ---------- 4️⃣ Additive / NOVA / Label contributions
  const additiveComponent =
    additives === 0
      ? 10
      : additives === 1
      ? 7
      : additives === 2
      ? 4
      : additives >= 3
      ? 0
      : 5;
  const novaMap = { 1: 10, 2: 7, 3: 3, 4: 0 };
  const novaComponent = novaMap[nova] ?? 5;
  const organicBonus = labels.some((l) =>
    ["organic", "bio", "eco", "ecocert"].some((tag) =>
      String(l).toLowerCase().includes(tag)
    )
  )
    ? 5
    : 0;

  // ---------- 5️⃣ Combine (weights roughly aligned to Yuka logic)
  let total =
    nutriComponent * 0.7 + // nutrition dominates
    additiveComponent * 1.5 + // scale from 0–15
    novaComponent * 1 + // 0–10
    organicBonus; // +5 max

  total = Math.max(0, Math.min(100, Math.round(total)));
  return total;
};

// -----------------
// BEAUTY SCORING (unchanged but explicit)
// -----------------
const calculateBeautyScore = (product) => {
  const ingredients = product.ingredients_analysis_tags || [];
  const additives = Number(product.additives_n ?? 0);
  const labels = product.labels_tags || [];

  let baseScore = 80;

  if (ingredients.includes("en:contains-carcinogens")) baseScore -= 30;
  if (ingredients.includes("en:contains-endocrine-disruptors")) baseScore -= 20;
  if (ingredients.includes("en:contains-irritant")) baseScore -= 10;
  if (ingredients.includes("en:contains-allergens")) baseScore -= 10;

  // Additive penalty (cosmetics may have preservatives etc.)
  baseScore -= Math.min(20, additives * 3);

  const organic = labels.some((l) =>
    ["organic", "bio", "ecocert", "cosmos-organic"].some((tag) =>
      String(l).toLowerCase().includes(tag)
    )
  );
  if (organic) baseScore += 8;

  return Math.round(Math.max(0, Math.min(100, baseScore)));
};

// -----------------
// RATING CONVERSION
// -----------------
// const getRating = (score, type = "food") => {
//   if (score >= 85)
//     return {
//       label: type === "beauty" ? "Excellent (Safe)" : "Excellent",
//       stars: 5,
//       color: "#2ecc71",
//     };
//   if (score >= 70)
//     return {
//       label: type === "beauty" ? "Good (Mostly Safe)" : "Good",
//       stars: 4,
//       color: "#27ae60",
//     };
//   if (score >= 50)
//     return {
//       label: type === "beauty" ? "Average (Some Risks)" : "Average",
//       stars: 3,
//       color: "#f39c12",
//     };
//   if (score >= 30)
//     return {
//       label: type === "beauty" ? "Poor (Risky Ingredients)" : "Poor",
//       stars: 2,
//       color: "#e74c3c",
//     };
//   return {
//     label: type === "beauty" ? "Bad (Unsafe)" : "Bad",
//     stars: 1,
//     color: "#c0392b",
//   };
// };
