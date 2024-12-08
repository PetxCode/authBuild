import { Router } from "express";
import {
  fundTransfer,
  fundWallet,
  viewTransactionHistory,
  verifyFundTransaction,
} from "../controller/transactionController";

const router: any = Router();

// PROFILE
router.route("/fund-account-wallet/").post(fundWallet);

router.route("/verify-fund/:reference").get(verifyFundTransaction);

router.route("/transfer-amount/:userID").post(fundTransfer);

router.route("/transaction-history/:userID/").get(viewTransactionHistory);

export default router;
