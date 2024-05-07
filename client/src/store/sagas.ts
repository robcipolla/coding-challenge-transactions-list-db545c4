import {
  BrowserProvider,
  Signer,
  Transaction,
  TransactionReceipt,
  TransactionResponse,
  parseEther,
} from "ethers";
import { put, takeEvery } from "redux-saga/effects";

import apolloClient from "../apollo/client";
import { navigate } from "../components/NaiveRouter";
import { SaveTransaction } from "../queries";
import { Action, Actions } from "../types";

interface SendTransactionPayload {
  recipient: string;
  amount: number;
}

function* sendTransaction(action: Action<SendTransactionPayload>) {
  yield put({ type: Actions.UpdateTransactionStatus, payload: "loading" });

  const walletProvider = new BrowserProvider(window.web3.currentProvider);
  const signer: Signer = yield walletProvider.getSigner();

  const transaction = {
    to: action.payload.recipient,
    value: parseEther(action.payload.amount.toString()),
  };

  try {
    const txResponse: TransactionResponse = yield signer.sendTransaction(
      transaction
    );
    const response: TransactionReceipt = yield txResponse.wait();

    const receipt: Transaction = yield response.getTransaction();

    const variables = {
      transaction: {
        gasLimit: (receipt.gasLimit && receipt.gasLimit.toString()) || "0",
        gasPrice: (receipt.gasPrice && receipt.gasPrice.toString()) || "0",
        to: receipt.to,
        from: receipt.from,
        value: (receipt.value && receipt.value.toString()) || "",
        data: receipt.data || null,
        chainId: (receipt.chainId && receipt.chainId.toString()) || "123456",
        hash: receipt.hash,
      },
    };

    yield apolloClient.mutate({
      mutation: SaveTransaction,
      variables,
    });

    yield put({
      type: Actions.UpdateTransactions,
      payload: {
        hash: receipt.hash,
        to: receipt.to,
        from: receipt.from,
        value: receipt.value.toString(),
      },
    });
    yield put({ type: Actions.UpdateTransactionStatus, payload: "success" });

    navigate(`/transaction/${receipt.hash}`);
  } catch (error) {
    console.error(error);
  }
}

export function* rootSaga() {
  yield takeEvery(Actions.SendTransaction, sendTransaction);
}
