import { Router, Request, Response } from "express";
import { isAfter } from "date-fns";
import Logging from "../library/logging";
import Product from "../ models/Product";
import { FILTER_MODE } from "../constants/app";

const router = Router();

router.get("/list", async (req: Request, res: Response) => {
  const { offset, limit, filter } = req.query;

  const products = await Product.find();

  let count = 0;
  const newLimit = Number(limit);
  const newOffset = Number(offset) + 1;
  const newProducts = [];
  const currentIdx = newLimit * newOffset - newLimit;

  while (count < Number(limit)) {
    if (!products[currentIdx + count]) break;
    newProducts.push(products[currentIdx + count]);
    count++;
  }

  if (filter) {
    switch (FILTER_MODE[`${filter}` as keyof typeof FILTER_MODE]) {
      case "priceUp":
        newProducts.sort((a, b) => {
          if (a.price > b.price) return 1;
          else if (a.price < b.price) return -1;
          return 0;
        });
        break;
      case "priceDown":
        newProducts.sort((a, b) => {
          if (a.price > b.price) return -1;
          else if (a.price < b.price) return 1;
          return 0;
        });
        break;
      case "A-Z":
        newProducts.sort((a, b) => {
          const aLowerCase = a.name.toLowerCase();
          const bLowerCase = b.name.toLowerCase();

          if (aLowerCase > bLowerCase) return 1;
          else if (aLowerCase < bLowerCase) return -1;
          return 0;
        });
        break;
      case "Z-A":
        newProducts.sort((a, b) => {
          const aLowerCase = a.name.toLowerCase();
          const bLowerCase = b.name.toLowerCase();

          if (aLowerCase > bLowerCase) return 1;
          else if (aLowerCase < bLowerCase) return -1;
          return 0;
        });
        break;
      case "Oldest":
        newProducts.sort((a, b) => {
          const aDate = new Date(a.createdAt);
          const bDate = new Date(b.createdAt);

          if (isAfter(aDate, bDate)) return 1;
          else if (isAfter(bDate, aDate)) return -1;
          return 0;
        });
        break;
      case "Newest":
        newProducts.sort((a, b) => {
          const aDate = new Date(a.createdAt);
          const bDate = new Date(b.createdAt);

          if (isAfter(aDate, bDate)) return -1;
          else if (isAfter(bDate, aDate)) return 1;
          return 0;
        });
        break;
      default:
        break;
    }
  }

  res.status(200).send({ data: newProducts });
});

router.post("/add-product", (req: Request, res: Response) => {
  const { product } = req.body;

  const newProducts = product.map((product: any) => ({
    ...product,
    createdAt: new Date().toISOString(),
  }));

  Product.collection.insertMany(newProducts, (err) => {
    if (err) {
      Logging.error(err.toString());
      return res.status(500).send({ message: "Internal server error" });
    }

    res.status(200).send({ message: "Insert Product successfully" });
  });
});

export default router;
