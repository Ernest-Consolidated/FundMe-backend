import { Request, Response } from "express";
import { createWallet } from "@bebapps/rapyd-sdk/dist/generated/wallet/apis/Wallet";
import { issueVirtualAccountNumberToWallet } from "@bebapps/rapyd-sdk/dist/generated/issuing/apis/VirtualAccountNumber";
import { CreateWalletRequest } from "@bebapps/rapyd-sdk/dist/generated/wallet/requests/CreateWalletRequest";
import { nanoid } from "nanoid";
import log from "../utils/logger";
import { issueCard } from "@bebapps/rapyd-sdk/dist/generated/issuing/apis/IssuedCard";
import { IssueVirtualAccountNumberToWalletRequest } from "@bebapps/rapyd-sdk/dist/generated/issuing/requests/IssueVirtualAccountNumberToWalletRequest";
import { IssueCardRequest } from "@bebapps/rapyd-sdk/dist/generated/issuing/requests/IssueCardRequest";
import { RapydClient } from "@bebapps/rapyd-sdk";
import { retrieveWalletBalances } from "@bebapps/rapyd-sdk/dist/generated/wallet/apis/WalletTransaction";
import { RetrieveWalletBalancesRequest } from "@bebapps/rapyd-sdk/dist/generated/wallet/requests/RetrieveWalletBalancesRequest";
import axios from "axios";

const rapid = new RapydClient(
  "1634e55cea1f50198d63e9768f9e06c8ab02f4cc3ca96171db448b716045bebbe52488821675393d",
  "967E1691B6E18C358D95"
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
  const { country, ewallet_contact, card_program }: IssueCardRequest = req.body;

  try {
    const result = await issueCard(rapid, {
      ewallet_contact,
      country,
      card_program,
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
