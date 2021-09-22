import { uploadFileToDBX } from "./dbx/dbxHandlers.js";

export const saveMenuCategoryData = async (data) => {
  console.log(data);

  // (1) Enrich request data
  // (2) Upload files/images to dbx
  // (2.1) Upload the files/images
  // (2.2) Get and modify shareable link
  let eData = { imgs: [] };
  let keyType = null;
  let keyName = null;
  let res = null;
  let failedUpoads = [];
  for (let key in data) {
    keyType = key.split("_")[0];
    keyName = key.split("_")[1];

    switch (keyType) {
      case "txt":
        eData[keyName] = data[key];
        break;
      case "pimg":
        res = await uploadFileToDBX(keyName, data[key]);
        if (res.status === "success") {
          eData.imgs.push({
            publicUrl: res.publicUrl,
            dbxFilePath: res.dbxFilePath,
            isPrimary: true,
          });
        } else {
          failedUpoads.push(keyName);
        }
        break;
      case "img":
        res = await uploadFileToDBX(keyName, data[key]);
        if (res.status === "success") {
          eData.imgs.push({
            publicUrl: res.publicUrl,
            dbxFilePath: res.dbxFilePath,
            isPrimary: false,
          });
        } else {
          failedUpoads.push(keyName);
        }
        break;
    }
  }
  console.log("eData");
  console.log(eData);
  console.log("failedUpoads");
  console.log(failedUpoads);

  // (3) Save enriched data to database

  return data;
};
