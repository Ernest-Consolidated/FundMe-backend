import { Request, Response } from "express";
import { createWallet } from "@bebapps/rapyd-sdk/dist/generated/wallet/apis/Wallet";
import { issueVirtualAccountNumberToWallet } from "@bebapps/rapyd-sdk/dist/generated/issuing/apis/VirtualAccountNumber";
import { rapid } from "../services/main.service";
import { CreateWalletRequest } from "@bebapps/rapyd-sdk/dist/generated/wallet/requests/CreateWalletRequest";
import { nanoid } from "nanoid";
import log from "../utils/logger";
import { issueCard } from "@bebapps/rapyd-sdk/dist/generated/issuing/apis/IssuedCard";
import { IssueVirtualAccountNumberToWalletRequest } from "@bebapps/rapyd-sdk/dist/generated/issuing/requests/IssueVirtualAccountNumberToWalletRequest";
import { IssueCardRequest } from "@bebapps/rapyd-sdk/dist/generated/issuing/requests/IssueCardRequest";

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

export const createVirtualAccountHandler = async (
  req: Request,
  res: Response
) => {
  const { country, ewallet }: IssueVirtualAccountNumberToWalletRequest =
    req.body;

  try {
    const result = await issueVirtualAccountNumberToWallet(rapid, {
      country,
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
  const { country, ewallet_contact }: IssueCardRequest = req.body;

  try {
    const result = await issueCard(rapid, {
      country,
      ewallet_contact,
    });

    if (!result) return;

    res.send(result);
  } catch (error: any) {
    log.error(error.message);
  }
};
