import { Router, Request, Response } from "express";
import Product from "../ models/Product";
import {
  getProductList,
  getSpecifiedProducts,
  addProducts,
} from "../controller/product.controller";

const router = Router();

router.get("/list", getProductList);

router.post("/add-product", addProducts);

router.get("/search-product", async (req: Request, res: Response) => {
  const { query } = req.query;

  const products = await Product.find();

  const result = products.filter((product) => {
    if (typeof query == "string") {
      const productLabel = product.name.substring(0, query.length);

      return productLabel.toLowerCase() == query.toLowerCase();
    }
  });

  return res.status(200).send({ data: result });
});

router.get("/get-specified-products", getSpecifiedProducts);

export default router;
