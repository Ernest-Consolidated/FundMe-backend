import { Request, Response } from "express";
import { createWallet } from "@bebapps/rapyd-sdk/dist/generated/wallet/apis/Wallet";
import { updateWalletContact } from "@bebapps/rapyd-sdk/dist/generated/wallet/apis/WalletContact";
import { issueVirtualAccountNumberToWallet } from "@bebapps/rapyd-sdk/dist/generated/issuing/apis/VirtualAccountNumber";
import { CreateWalletRequest } from "@bebapps/rapyd-sdk/dist/generated/wallet/requests/CreateWalletRequest";
import { createCheckoutPage } from "@bebapps/rapyd-sdk/dist/generated/collect/apis/CheckoutPage";
import { createIdentityVerificationPage } from "@bebapps/rapyd-sdk/dist/generated/wallet/apis/IdentityVerification";
import { nanoid } from "nanoid";
import log from "../utils/logger";
import { issueCard } from "@bebapps/rapyd-sdk/dist/generated/issuing/apis/IssuedCard";
import { IssueVirtualAccountNumberToWalletRequest } from "@bebapps/rapyd-sdk/dist/generated/issuing/requests/IssueVirtualAccountNumberToWalletRequest";
import { IssueCardRequest } from "@bebapps/rapyd-sdk/dist/generated/issuing/requests/IssueCardRequest";
import { RapydClient } from "@bebapps/rapyd-sdk";
import { retrieveWalletBalances } from "@bebapps/rapyd-sdk/dist/generated/wallet/apis/WalletTransaction";
import { RetrieveWalletBalancesRequest } from "@bebapps/rapyd-sdk/dist/generated/wallet/requests/RetrieveWalletBalancesRequest";
import { UpdateWalletRequest } from "@bebapps/rapyd-sdk/dist/generated/wallet/requests/UpdateWalletRequest";
import { UpdateWalletContactRequest } from "@bebapps/rapyd-sdk/dist/generated/wallet/requests/UpdateWalletContactRequest";
import { CreateCheckoutPageRequest } from "@bebapps/rapyd-sdk/dist/generated/collect/requests/CreateCheckoutPageRequest";
import { CreateIdentityVerificationPageRequest } from "@bebapps/rapyd-sdk/dist/generated/wallet/requests/CreateIdentityVerificationPageRequest";
require("dotenv").config();

const rapid = new RapydClient(
  process.env.SECRET_KEY as any,
  process.env.ACCESS_TOKEN as any
);

export const createWalletHandler = async (req: Request, res: Response) => {
  const { first_name, last_name, type, contact }: CreateWalletRequest =
    req.body;

  try {
    const response = await createWallet(rapid, {
      first_name,
      last_name,
      type,
      contact,
      metadata: {
        merchant_defined: true,
      },
      ewallet_reference_id: `referenceId_${nanoid()}`,
    });

    if (!response) return;

    res.send(response);
  } catch (error: any) {
    log.error(error.message);
  }
};

export const updateWalletHandler = async (req: Request, res: Response) => {
  const { wallet, date_of_birth, contact }: UpdateWalletContactRequest =
    req.body;

  try {
    const response = await updateWalletContact(rapid, {
      wallet,
      contact,
      date_of_birth,
      // address,
      metadata: {
        merchant_defined: "updated",
      },
    });

    if (!response) return;

    res.send(response);
  } catch (error: any) {
    log.error(error.message);
  }
};

export const createVirtualAccountHandler = async (
  req: Request,
  res: Response
) => {
  const { ewallet }: IssueVirtualAccountNumberToWalletRequest = req.body;

  try {
    const result = await issueVirtualAccountNumberToWallet(rapid, {
      country: "United States",
      ewallet,
      description: "Issue virtual account number to wallet",
      currency: "USD",
      merchant_reference_id: `mrID_${nanoid()}`,
    });

    if (!result) return;

    res.send(result);
  } catch (error: any) {
    log.error(error.message);
  }
};

export const createVirtualCardHandler = async (req: Request, res: Response) => {
  const { ewallet_contact }: IssueCardRequest = req.body;

  try {
    const result = await issueCard(rapid, {
      ewallet_contact,
      card_program: "cardprog_2dc16a9721c1884ab836fb2af5a04c5b",
    });

    if (!result) return;

    res.send(result);
  } catch (error: any) {
    log.error(error);
  }
};

export const getWalletBalancesHandler = async (req: Request, res: Response) => {
  const { wallet }: RetrieveWalletBalancesRequest = req.body;

  try {
    const result = await retrieveWalletBalances(rapid, {
      wallet,
    });

    if (!result) return;

    res.send(result);
  } catch (error: any) {
    log.error(error.message);
  }
};

export const createCheckoutHandler = async (req: Request, res: Response) => {
  const { amount, currency, country, ewallet }: CreateCheckoutPageRequest =
    req.body;

  try {
    if (country === "NG") {
      return;
    }

    const result = await createCheckoutPage(rapid, {
      amount,
      currency,
      country,
      ewallet,
      complete_payment_url: "https://help-fd14d.web.app/payment_success",
    });

    if (!result) return;

    res.send(result.redirect_url);
  } catch (error: any) {
    log.error(error.message);
  }
};

export const verifyIdentityHandler = async (req: Request, res: Response) => {
  const { contact, ewallet }: CreateIdentityVerificationPageRequest = req.body;

  try {
    const result = await createIdentityVerificationPage(rapid, {
      contact,
      ewallet,
      reference_id: `ref_${nanoid(11)}`,
      // complete_url: "https://help-fd14d.web.app/complete",
      // cancel_url: "https://help-fd14d.web.app/dashboard",
    });

    if (!result) return;

    const dashboard = "dashboard";

    // res.send({result, dashboard});
    res.send(result);
  } catch (error: any) {
    log.error(error);
  }
};
