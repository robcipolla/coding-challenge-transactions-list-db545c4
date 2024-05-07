import { Actions } from "../types";

// Define the state type
export interface RootState {
  senderAddress: string | undefined;
  transactionStatus: "pending" | "loading" | "success" | "failure";
  initialLoad: boolean;
  transactions: any[];
}

// Initial state
const initialState: RootState = {
  senderAddress: undefined,
  transactionStatus: "pending",
  initialLoad: false,
  transactions: [],
};

const reducer = (state = initialState, action: any): RootState => {
  switch (action.type) {
    case Actions.UpdateTransactionStatus:
      return {
        ...state,
        transactionStatus: action.payload,
      };
    case Actions.updateSenderAddress:
      return {
        ...state,
        senderAddress: action.payload,
      };
    case Actions.InitializeTransactions:
      return {
        ...state,
        transactions: [...state.transactions, ...action.payload.transactions],
        initialLoad: action.payload.initialLoad,
      };
    case Actions.UpdateTransactions:
      return {
        ...state,
        transactions: [...state.transactions, ...action.payload],
      };
    default:
      return state;
  }
};

export default reducer;
