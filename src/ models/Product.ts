import { model, Schema, ValidatorProps } from "mongoose";

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
  quantity: {
    type: Number,
    required: true,
  },
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
