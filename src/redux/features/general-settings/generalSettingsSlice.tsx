import { PayloadAction, createSlice } from "@reduxjs/toolkit";
import { RootState } from "../../store";

export interface GeneralConfigInterface {
  active_key_menu: string
}
export interface GeneralInformationInterface {
  site_title: string
  site_address: string
}
export interface GeneralSettingsInterface {
  general_config?: GeneralConfigInterface;
  general_information?: GeneralInformationInterface;
}

export const InitialStateGeneralSettings: GeneralSettingsInterface = {
  general_config: undefined,
  general_information: undefined,
};

const generalSettingsSlice = createSlice({
  name: 'generalSettings',
  initialState: InitialStateGeneralSettings,
  reducers: {
    setGeneralSettings: (state, action: PayloadAction<Partial<GeneralSettingsInterface>>) => {
      return {
        ...state,
        ...action.payload,
      };
    },
  },
})

export const { setGeneralSettings } = generalSettingsSlice.actions

export const selectGeneralSettings = (state: RootState) => state.generalSettings!
export default generalSettingsSlice.reducer