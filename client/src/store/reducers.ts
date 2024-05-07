import { Actions } from "../types";

// Define the state type
export interface RootState {
  senderAddress: string | undefined;
  transactions: any[];
}

// Initial state
const initialState: RootState = {
  senderAddress: undefined,
  transactions: [],
};

const reducer = (state = initialState, action: any): RootState => {
  switch (action.type) {
    case Actions.updateSenderAddress:
      return {
        ...state,
        senderAddress: action.payload,
      };
    default:
      return state;
  }
};

export default reducer;
