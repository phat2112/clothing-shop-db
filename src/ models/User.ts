import { model, Schema, ValidatorProps } from "mongoose";

const UserSchema = new Schema({
  firstName: {
    type: String,
    require: true,
  },
  lastName: {
    type: String,
    required: true,
  },
  sex: {
    type: Number, // 0: male, 1: female
    required: true,
  },
  birthday: {
    type: String,
    required: true,
    validate: {
      validator: (v: string) => {
        if (!v) return false;
        const date = new Date(v);
        return date instanceof Date && date.toISOString() === v;
      },
      message: (props: ValidatorProps) => `${props.value} is not a valid date`,
    },
  },
  email: {
    type: String,
    required: true,
    unique: true,
    validate: {
      validator: (v: string) =>
        /^(([^<>()\[\]\\.,;:\s@"]+(\.[^<>()\[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/.test(
          v
        ),
      message: (props: ValidatorProps) =>
        `${props.value} is not a valid email address`,
    },
  },
  password: {
    type: String,
    required: true,
  },
});

const User = model("User", UserSchema);
export default User;
