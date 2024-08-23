import { PayloadAction, createSlice } from "@reduxjs/toolkit";
import { RootState } from "../../store";
import { UserAttributes } from "@/types/users";
import { RoleAttributes } from "@/types/roles";

export interface AuthReduxInterface {
  user?: UserAttributes
  roleActive: RoleAttributes
  isLogin: boolean
  token: string
  exp: number
}

export const InitialStateAuthRedux: AuthReduxInterface = {
  user: undefined,
  roleActive: {
    id: 0,
    name: "",
    description: "",
    createdBy: 0
  },
  token: '',
  isLogin: false,
  exp: 0
};

const authReduxSlice = createSlice({
  name: 'authRedux',
  initialState: InitialStateAuthRedux,
  reducers: {
    setAuthRedux: (state, action: PayloadAction<Partial<AuthReduxInterface>>) => {
      return {
        ...state,
        ...action.payload,
      };
    },
  },
})

export const { setAuthRedux } = authReduxSlice.actions

export const selectAuthRedux = (state: RootState) => state.generalSettings!
export default authReduxSlice.reducer