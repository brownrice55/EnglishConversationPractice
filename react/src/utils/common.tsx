import type { Inputs } from "../types/inputs.type";
export function getData() {
  let data = new Map<number, Inputs>();
  const dataFromLocalStorage: string | null = localStorage.getItem(
    "EnglishConversationPractice"
  );
  if (dataFromLocalStorage !== "undefined") {
    let dataJson: any;
    if (typeof dataFromLocalStorage === "string") {
      dataJson = JSON.parse(dataFromLocalStorage);
    } else {
      dataJson = null;
    }
    data = new Map(dataJson);
  }
  return data;
}

import { settingsTitleArray } from "../config/titleData";
export const getTitleData = () => {
  const path: string = location.pathname.split("/")[2];
  const titleData = settingsTitleArray.filter((val) => val.link === path);
  return titleData[0];
};
