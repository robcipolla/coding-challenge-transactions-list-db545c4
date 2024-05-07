import React, { useEffect } from "react";
import { useQuery } from "@apollo/client";
import { GetAllTransactions } from "../queries";
import { Actions, TransactionsData } from "../types";
import { navigate } from "./NaiveRouter";
import { formatEther } from "ethers";
import { useDispatch, useSelector } from "react-redux";

interface Transaction {
  gasLimit: string;
  gasPrice: string;
  to: string;
  from: string;
  value: string;
  data?: string;
  chainId: string;
  hash: string;
}

const TransactionList: React.FC = () => {
  const dispatch = useDispatch();
  const { loading, error, data } =
    useQuery<TransactionsData>(GetAllTransactions);

  useEffect(() => {
    if (!data) return;

    dispatch({
      type: Actions.UpdateTransactions,
      payload: data?.getAllTransactions,
    });
  }, [data, dispatch]);

  const transactions = useSelector((state: any) => state.transactions);

  const handleNavigate = (hash: string) => navigate(`/transaction/${hash}`);

  if (loading) {
    return (
      <div className="flex flex-col mt-20">
        <div className="max-w-[85rem] w-full mx-auto px-4 sm:flex sm:items-center sm:justify-between">
          Loading...
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="flex flex-col mt-20">
        <div className="max-w-[85rem] w-full mx-auto px-4 sm:flex sm:items-center sm:justify-between text-red-600 font-bold">
          Error: {error.message}
        </div>
      </div>
    );
  }

  return (
    <div className="flex flex-col mt-20">
      <div className="max-w-[85rem] w-full mx-auto px-4 sm:flex sm:items-center sm:justify-between">
        <div className="p-1.5 min-w-full inline-block align-middle">
          {!!transactions?.length ? (
            <>
              {transactions.map(({ hash, to, from, value }: Transaction) => {
                const formattedValue = formatEther(BigInt(value));
                return (
                  <div
                    key={hash}
                    className="bg-white shadow-sm p-4 md:p-5 border rounded border-gray-300 mt-3 hover:border-blue-500 cursor-pointer"
                    onClick={() => handleNavigate(hash)}
                  >
                    <span className="font-bold">{formattedValue} ETH</span> sent
                    from <span className="font-bold">{from}</span> to{" "}
                    <span className="font-bold">{to}</span>
                  </div>
                );
              })}
            </>
          ) : (
            <p>No transactions available yet</p>
          )}
        </div>
      </div>
    </div>
  );
};

export default TransactionList;
