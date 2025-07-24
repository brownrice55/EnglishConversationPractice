import type { Inputs } from "../types/inputs.type";
export function getData() {
  let data = new Map<number, Inputs>();
  const dataFromLocalStorage: string | null = localStorage.getItem(
    "EnglishConversationPractice"
  );
  if (dataFromLocalStorage !== "undefined") {
    if (typeof dataFromLocalStorage === "string") {
      const dataJson = JSON.parse(dataFromLocalStorage);
      const dataJsonTypeChanged = dataJson.map(
        ([key, val]: [number, Inputs]) => [
          key,
          { ...val, category: Number(val.category) },
        ]
      );
      data = new Map(dataJsonTypeChanged);
    } else {
      data = new Map(null);
    }
  }
  return data;
}

export function getRandomIndexArray(aData: Map<number, Inputs>) {
  const data = aData;
  const array = Array.from(data.keys());
  for (let cnt = array.length - 1; cnt > 0; --cnt) {
    const random = Math.floor(Math.random() * (cnt + 1));
    [array[cnt], array[random]] = [array[random], array[cnt]];
  }
  return array;
}

import { settingsTitleArray } from "../config/titleData";
export function getTitleData() {
  const path: string = location.pathname.split("/")[2];
  const titleData = settingsTitleArray.filter((val) => val.link === path);
  return titleData[0];
}

import type { InputsCategory } from "../types/inputsCategory.type";
export function getCategories(): InputsCategory {
  const raw = localStorage.getItem("EnglishConversationPracticeCategory");
  const data: { category: string; categoryId: number }[] = raw
    ? JSON.parse(raw)
    : [{ category: "", categoryId: 0 }];
  return { categories: data };
}

export function getAudio() {
  const raw = localStorage.getItem("EnglishConversationPracticeAudio");
  const data: string[] = raw ? JSON.parse(raw) : ["en-GB", "en-GB"];
  return data;
}

export function getSelectedCategories(aData: Map<number, Inputs>) {
  const originalCategories: InputsCategory = getCategories();
  const originalData: Map<number, Inputs> = aData;
  const categoryIdsInData =
    originalData &&
    [...originalData.values()].map((val) => val.category).map(Number);
  const selectedCategories = originalCategories.categories.filter((val) =>
    categoryIdsInData.includes(val.categoryId)
  );
  return selectedCategories;
}

export function getListData() {
  let data = new Map<number, Inputs>();
  const dataFromLocalStorage: string | null = localStorage.getItem(
    "EnglishConversationPracticeList"
  );
  if (dataFromLocalStorage !== "undefined") {
    if (typeof dataFromLocalStorage === "string") {
      const dataJson = JSON.parse(dataFromLocalStorage);
      data = new Map(dataJson);
    } else {
      data = new Map(null);
    }
  }
  return data;
}
