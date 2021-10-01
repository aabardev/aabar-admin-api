import * as db from "./db/dbHandlers.js";
import { imgTypeCodes } from "./utils.js";

export const saveMenuCategory = async (data) => {
  console.log(data);
  let eData = { imgs: [] };
  let keySplit = null;
  let res = null;

  // (1) Validate and Prepare the data for upload and save
  if (data.txt_isActive === 'false') {
    eData.id = data.txt_id;
    eData.isActive = data.txt_isActive;
  } else {
    for (let key in data) {
      keySplit = key.split("_");
      if (keySplit[0] === "txt") {
        eData[keySplit[1]] = data[key];
      } else if (keySplit[0] === "img") {
        // { img_id_typeCode_isPrimary_isActive_filename: content }
        //eg: { img_4_mc_true_true_breakfast1: [Buffer type] }
        eData.imgs.push({
          id: keySplit[1] ? keySplit[1] : null,
          refId: null,
          type: imgTypeCodes[keySplit[2]],
          url: null,
          dbxPath: null,
          isPrimary: keySplit[3],
          isActive: keySplit[4],
          filename: keySplit[5],
          content: data[key],
        });
      }
    }
  }
  
  console.log('eData');
  console.log(eData);

  // (2) Save data to db
  res = await db.upsertMenuCategory(eData);
  console.log("RES:", res);
  if (res.status === "success" ) {
    return { status: res.status, msg: "Menu Category saved successfully" };
  } else {
    return {
      status: res.status,
      error: res.error,
      msg: "Could not save Menu Category",
    };
  }
};
