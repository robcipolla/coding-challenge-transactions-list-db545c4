import Onboard from "@web3-onboard/core";
import injectedModule from "@web3-onboard/injected-wallets";
import React, { useCallback } from "react";

import { useDispatch, useSelector } from "react-redux";
import { RootState } from "../store/reducers";
import { Actions } from "../types";
import SendTransaction from "./SendTransaction";

const injected = injectedModule();

const onboard = Onboard({
  wallets: [injected],
  chains: [
    {
      id: "123456",
      token: "ETH",
      label: "Local Ganache",
      rpcUrl: "http://localhost:8545",
    },
  ],
});

const Navigation: React.FC = () => {
  const senderAddress = useSelector((state: RootState) => state.senderAddress);
  const dispatch = useDispatch();

  const handleConnect = useCallback(async () => {
    const wallets = await onboard.connectWallet();

    const [metamaskWallet] = wallets;

    if (
      metamaskWallet.label === "MetaMask" &&
      metamaskWallet.accounts[0].address
    ) {
      dispatch({
        type: Actions.updateSenderAddress,
        payload: metamaskWallet.accounts[0].address,
      });
    }
  }, [dispatch]);

  return (
    <header className="flex flex-wrap sm:justify-start sm:flex-nowrap z-50 w-ful text-sm py-4 bg-gray-800">
      <nav className="max-w-[85rem] w-full mx-auto px-4 sm:flex sm:items-center sm:justify-between">
        <div className="flex items-center justify-between">
          <a
            className="flex-none text-xl font-semibold dark:text-white"
            href="."
          >
            Transactions List
          </a>
        </div>
        <div className="hs-collapse overflow-hidden transition-all duration-300 basis-full grow sm:block">
          <div className="flex flex-col gap-5 sm:flex-row sm:items-center sm:justify-end sm:mt-0 sm:pl-5">
            {senderAddress && (
              <>
                <SendTransaction />
                <p className="py-3 px-4 inline-flex justify-center items-center gap-2 rounded-md border-2 border-gray-200 font-semibold text-gray-200 text-sm">
                  {senderAddress}
                </p>
              </>
            )}
            {!senderAddress && (
              <button
                type="button"
                onClick={handleConnect}
                className="py-3 px-4 inline-flex justify-center items-center gap-2 rounded-md border-2 border-gray-200 font-semibold text-gray-200 hover:text-white hover:bg-gray-500 hover:border-gray-500 focus:outline-none focus:ring-2 focus:ring-gray-200 focus:ring-offset-2 transition-all text-sm"
              >
                Connect Wallet
              </button>
            )}
          </div>
        </div>
      </nav>
    </header>
  );
};

export default Navigation;
