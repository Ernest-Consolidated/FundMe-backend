import mongoose from "mongoose";
import { customAlphabet } from "nanoid";

const nanoid = customAlphabet("abcdefghijklmnopqrstuvwxyz0123456789", 10);

export interface DonateInput {
  name: string;
  organization: string;
  amount: number;
}

export interface DonateDocument extends DonateInput, mongoose.Document {
  userId: string;
  transferred: boolean;
  createdAt: Date;
  updatedAt: Date;
}

const DonateSchema = new mongoose.Schema(
  {
    userId: {
      type: String,
      required: true,
      unique: true,
      default: () => `user_${nanoid()}`,
    },
    name: {
      type: String,
      required: true,
    },
    amount: {
      type: String,
      required: true,
    },
    organization: {
      type: String,
      required: true,
    },
    transferred: {
      type: Boolean,
      required: true,
      default: false,
    },
  },
  {
    timestamps: true,
  }
);

const DonateModel = mongoose.model<DonateDocument>("Donate", DonateSchema);

export default DonateModel;
