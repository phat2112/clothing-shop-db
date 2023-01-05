import { Router } from "express";
import Product from "../ models/Product";
import {
  getProductList,
  getSpecifiedProducts,
  addProducts,
  getSearchedProducts,
} from "../controller/product.controller";

const router = Router();

router.get("/list", getProductList);

router.post("/add-product", addProducts);

router.get("/search-product", getSearchedProducts);

router.get("/get-specified-products", getSpecifiedProducts);

export default router;
