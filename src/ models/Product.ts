import { model, Schema, ValidatorProps } from "mongoose";

const amountSchema = new Schema({
  size: {
    type: Number,
    required: true,
    unique: true,
  },
  quantity: {
    type: Number,
    required: true,
  },
  alias: {
    type: String,
    required: true,
    unique: true,
  },
});

const ProductSchema = new Schema({
  name: {
    type: String,
    required: true,
  },
  category: {
    type: String, // top, bottom, accessory, set
    required: true,
  },
  image1: {
    type: String,
  },
  image2: {
    type: String,
  },
  price: {
    type: Number,
    required: true,
  },
  salePrice: {
    type: Number,
    required: false,
  },
  amount: [amountSchema],
  createdAt: {
    type: String,
    required: true,
    validate: {
      validator: (v: string) => {
        if (!v) return false;
        const date = new Date(v);
        return date instanceof Date;
      },
      message: (props: ValidatorProps) => `${props.value} is not a valid date`,
    },
  },
});

const Product = model("Product", ProductSchema);
export default Product;
