import { Request, Response } from "express";
import { RapydClient } from "@bebapps/rapyd-sdk";
import { createDonation } from "../services/donate.service";
import { donateData } from "../../types";
import { ValidationError, validationResult } from "express-validator";
import { createPayment } from "@bebapps/rapyd-sdk/dist/generated/collect/apis/Payment";
import { SimulateABankTransferToAWalletRequest } from "@bebapps/rapyd-sdk/dist/generated/issuing/requests/SimulateABankTransferToAWalletRequest";
import log from "../utils/logger";

const rapid = new RapydClient(
  "1634e55cea1f50198d63e9768f9e06c8ab02f4cc3ca96171db448b716045bebbe52488821675393d",
  "967E1691B6E18C358D95"
);

export async function createDonationHandler(req: Request, res: Response) {
  res.header("Access-Control-Allow-Origin", "*");

  const errorFormatter = ({
    location,
    msg,
    param,
    value,
    nestedErrors,
  }: ValidationError) => {
    // Build your resulting errors however you want! String, object, whatever - it works!
    return `${location}[${param}]: ${msg}`;
  };

  const { name, userWalletId, amount, payment_method }: donateData = req.body;

  try {
    const result = validationResult(req).formatWith(errorFormatter);
    if (!result.isEmpty()) {
      res.json({ errors: result.array() });
    }

    const response = await createPayment(rapid, {
      amount,
      currency: "SGD",
      payment_method,
      description: "Payment by card",
      payment_method_options: {
        "3d_required": "true",
      },
      error_payment_url: "https://help-fd14d.web.app/payment_error",
      complete_payment_url: "https://help-fd14d.web.app/payment_success",
      capture: true,
      ewallets: [
        {
          ewallet: userWalletId,
          percentage: 100,
        },
      ],
    });

    // console.log(response);

    if (response) {
      await createDonation({ name, userWalletId, amount });
      log.info(`---------------`);
      log.info(`------Donation Created-------`);
    }

    // const URI = `https://enigmatic-mesa-12584.herokuapp.com/${response.redirect_url}`;
    // log.info(URI);
    res.send(response.redirect_url);
  } catch (error: any) {
    log.error(error.message);
  }
}
