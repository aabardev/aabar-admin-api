import * as db from "./dbAccessMain.js";
import * as dbx from "../dbx/dbxHandlers.js";

export const upsertImage = async (img) => {
  console.log(img);
  let res = {};
  let actionTaken = null;
  if (img.isActive === "false") {
    await db.query(
      `UPDATE public.image SET is_active = $1, updated_on = NOW() WHERE id = $2;`,
      [img.isActive, img.id]
    );
    // delete from dbx
    actionTaken = "imgage_deactivated";
  } else if (img.isActive === "true") {
    if (img.content) {
      res = await dbx.uploadFileToDBX(img.filename, img.content);
    }

    if (res.status === "success") {
      img.dbxPath = res.dbxFilePath;
      img.url = res.publicUrl;

      if (img.isPrimary === 'true') {
        await db.query(
          `UPDATE public.image SET is_primary = false, updated_on = NOW() WHERE type = $1 and ref_id = $2`,
          [img.type, img.refId]
        );
        console.log("erased primary");
      }

      if (img.id) {
        //edit
        await db.query(
          `UPDATE public.image
        SET 
            type = COALESCE(NULLIF($1,''), type),
            ref_id = COALESCE(NULLIF($2,''), ref_id::varchar)::integer,
            url = COALESCE(NULLIF($3,''), url),
            dbx_path = COALESCE(NULLIF($4,''), dbx_path),
            is_primary = COALESCE(NULLIF($5,''), is_primary::varchar)::boolean,
            is_active = COALESCE(NULLIF($6,''), is_active::varchar)::boolean,
            updated_on = NOW()
        WHERE id = $7;`,
          [
            img.type,
            img.refId,
            img.url,
            img.dbxPath,
            img.isPrimary,
            img.isActive,
            img.id,
          ]
        );
        actionTaken = "imgage_updated";
      } else {
        //insert
        await db.query(
          `INSERT INTO public.image (type, ref_id, url, dbx_path, is_primary, is_active) VALUES ($1, $2, $3, $4, $5, true);`,
          [img.type, img.refId, img.url, img.dbxPath, img.isPrimary]
        );
        actionTaken = "imgage_inserted";
      }
    }
  }

  if (actionTaken) {
    return {
      status: "success",
      msg: actionTaken,
    };
  }
  return {
    status: "failed",
  };
};

export const upsertMenuCategory = async (data) => {
  // const client = await db.pool.connect();

  // (1) save menu category data into db
  let resp = { status: "failed" };
  try {
    let res = null;
    let actionTaken = null;
    if (data.isActive === "false") {
      //delete
      res = await db.query(
        "UPDATE public.menu_category SET is_active = $1, updated_on = NOW() WHERE id = $2 RETURNING id;",
        [data.isActive, data.id]
      );
      actionTaken = "menu_category_deactivated";
    } else if (data.isActive === "true") {
      if (data.id) {
        //edit
        res = await db.query(
          `UPDATE public.menu_category
          SET 
            title = COALESCE (NULLIF ($1, ''), title),
            description = COALESCE (NULLIF ($2, ''), description),
            updated_on = NOW()
          WHERE 
            id = $3 
          RETURNING id;`,
          [data.title, data.desc, data.id]
        );
        actionTaken = "menu_category_updated";
      } else {
        //insert
        res = await db.query(
          "INSERT INTO public.menu_category (title, description, is_active) VALUES ($1, $2, true) RETURNING id;",
          [data.title, data.desc]
        );
        actionTaken = "menu_category_inserted";
      }
    }
    console.log("res");
    console.log(res);

    // (2) save image data into db
    if (actionTaken !== "menu_category_deactivated") {
      let img = null;
      let refId = res.rows[0].id;
      for (let i=0; i<data.imgs.length; i++) {
        img = data.imgs[i];
        img.refId = refId;
        res = await upsertImage(img);
      }
    }
    
    return { status: 'success' }
  } catch (error) {
    return { status: 'failed', error: error }
  }
};
