import { uploadFileToDBX } from "./dbx/dbxHandlers.js";
import { insertNewMenuCategory } from "./db/dbHandlers.js";

export const addNewMenuCategory = async (data) => {
  console.log(data);

  // (1) Enrich request data
  // (2) Upload files/images to dbx
  // (2.1) Upload the files/images
  // (2.2) Get and modify shareable link
  let eData = { imgs: [] };
  let keySplit = null;
  let res = null;
  let failedUpoads = [];
  for (let key in data) {
    keySplit = key.split("_"); // keySplit[0] = field type, keySplit[0]
    switch (keySplit[0]) {
      case "txt":
        eData[keySplit[1]] = data[key];
        break;
      case "img":
        let imgProps = {
          publicUrl: null,
          dbxFilePath: null,
          type: null,
          isPrimary: null,
        };
        switch (keySplit[1]) {
          case "p":
            imgProps.type = "menu_category";
            imgProps.isPrimary = true;
            break;
          case "pl":
            imgProps.type = "menu_category_large";
            imgProps.isPrimary = true;
            break;
          case "np":
            imgProps.type = "menu_category";
            imgProps.isPrimary = false;
            break;
          case "npl":
            imgProps.type = "menu_category_large";
            imgProps.isPrimary = false;
            break;
        }
        res = await uploadFileToDBX(keySplit[2], data[key]);
        if (res.status === "success") {
          imgProps.dbxFilePath = res.dbxFilePath;
          imgProps.publicUrl = res.publicUrl;
          eData.imgs.push(imgProps);
        } else {
          failedUpoads.push(keySplit[2]);
        }
        break;
    }
  }
  console.log("eData");
  console.log(eData);
  console.log("failedUpoads");
  console.log(failedUpoads);

  // (3) Save enriched data to database
  res = await insertNewMenuCategory(eData);
  console.log("RES:", res);
  if (res.status === "success") {
    return { status: res.status, msg: "Menu Category saved successfully" };
  } else {
    return {
      status: res.status,
      error: res.error,
      msg: "Could not save Menu Category",
    };
  }
};
