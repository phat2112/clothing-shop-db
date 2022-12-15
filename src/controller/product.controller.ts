import { Request, Response } from "express";
import { isAfter } from "date-fns";

import Product from "../ models/Product";
import Logging from "../library/logging";
import { FILTER_MODE, RELATED_PRODUCTS } from "../constants/app";

const filterCond = (newProducts: any[], filter: any) => {
  switch (FILTER_MODE[filter as keyof typeof FILTER_MODE]) {
    case "priceUp":
      return newProducts.sort((a, b) => {
        if (a.price > b.price) return 1;
        else if (a.price < b.price) return -1;
        return 0;
      });
    case "priceDown":
      return newProducts.sort((a, b) => {
        if (a.price > b.price) return -1;
        else if (a.price < b.price) return 1;
        return 0;
      });
    case "a-z":
      return newProducts.sort((a, b) => {
        const aLowerCase = a.name.toLowerCase();
        const bLowerCase = b.name.toLowerCase();

        if (aLowerCase > bLowerCase) return 1;
        else if (aLowerCase < bLowerCase) return -1;
        return 0;
      });
    case "z-a":
      return newProducts.sort((a, b) => {
        const aLowerCase = a.name.toLowerCase();
        const bLowerCase = b.name.toLowerCase();

        if (aLowerCase > bLowerCase) return -1;
        else if (aLowerCase < bLowerCase) return 1;
        return 0;
      });
    case "oldest":
      return newProducts.sort((a, b) => {
        const aDate = new Date(a.createdAt);
        const bDate = new Date(b.createdAt);

        if (isAfter(aDate, bDate)) return 1;
        else if (isAfter(bDate, aDate)) return -1;
        return 0;
      });
    case "newest":
      return newProducts.sort((a, b) => {
        const aDate = new Date(a.createdAt);
        const bDate = new Date(b.createdAt);

        if (isAfter(aDate, bDate)) return -1;
        else if (isAfter(bDate, aDate)) return 1;
        return 0;
      });
    default:
      return newProducts;
  }
};

export const getProductList = async (req: Request, res: Response) => {
  try {
    const { offset, limit, filter } = req.query;

    const products = await Product.find();

    let count = 0;
    const newLimit = Number(limit);
    const newOffset = Number(offset) + 1;
    let newProducts = [];
    const currentIdx = newLimit * newOffset - newLimit;

    while (count < Number(limit)) {
      if (!products[currentIdx + count]) break;
      newProducts.push(products[currentIdx + count]);
      count++;
    }

    if (filter) {
      newProducts = filterCond(newProducts, filter);
    }

    res.status(200).send({ data: newProducts });
  } catch (error) {
    Logging.error(error);
  }
};

export const addProducts = (req: Request, res: Response) => {
  try {
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
  } catch (error) {
    Logging.error(error);
  }
};

export const getSpecifiedProducts = async (req: Request, res: Response) => {
  try {
    const { type, limit, category } = req.query;

    const products = await Product.find();

    let newProducts: any[] = [];
    if (RELATED_PRODUCTS[type as keyof typeof RELATED_PRODUCTS] === "related") {
      const currentProds = products.filter(
        (product) => product.category === category
      );

      newProducts = currentProds.splice(
        0,
        Math.min(Number(limit), currentProds.length)
      );
    } else if (
      RELATED_PRODUCTS[type as keyof typeof RELATED_PRODUCTS] === "bestSeller"
    ) {
      newProducts = products.splice(0, 5);
    }

    res.status(200).send({ data: newProducts });
  } catch (error) {
    Logging.error(error);
  }
};
