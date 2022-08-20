import DonateModel, { DonateInput } from "../models/donate.model";

export async function createUser(input: DonateInput) {
  try {
    const Donation = await DonateModel.create(input);

    return Donation;
  } catch (error: any) {
    throw new Error(error);
  }
}
