import { Userstate } from "tmi.js";
// Constants

export const SOUNDPATH = "/assets/sounds/";
export const VOLUME = 0.19;

// Interfaces
export interface FilterData {
  userName: string;
  message: string;
  firstMessage: Boolean;
  event: string | boolean;
}

// Functions
export const filterDataParams = (
  message: string,
  userState: Userstate
): FilterData => {
  userState.username = userState.username ?? "";
  const messageLowerCase = message.toLowerCase();
  const firstMsg: boolean = userState["first-msg"];

  return {
    userName: userState.username,
    message: messageLowerCase,
    firstMessage: firstMsg,
    event: false,
  };
};
