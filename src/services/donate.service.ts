import DonateModel, { DonateInput } from "../models/donate.model";

export async function createDonation(input: DonateInput) {
  try {
    const Donation = await DonateModel.create(input);

    return Donation;
  } catch (error: any) {
    throw new Error(error);
  }
}
