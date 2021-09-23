import * as db from "./dbAccessMain.js";

export const insertNewMenuCategory = async (data) => {
  const client = await db.pool.connect();
  let resp = { status: "failed" };
  try {
    await client.query("BEGIN");

    let res = await client.query(
      "INSERT INTO public.menu_category (title,description,is_active) VALUES ($1,$2,true) RETURNING id;",
      [data.title, data.desc]
    );
    console.log(res);
    for (let i = 0, img = null; i < data.imgs.length; i++) {
      img = data.imgs[i];
      console.log(res.rows[0].id);
      console.log(img);
      if (img.isPrimary === true) {
        await client.query(
          `UPDATE public.image SET is_primary = false WHERE type = $1 and ref_id = $2 and is_primary = true and is_active = true;`,
          [img.type, res.rows[0].id]
        );
        console.log("updated");
      }

      await client.query(
        `INSERT INTO public.image (ref_id,dbx_path,url,type,is_primary,is_active) VALUES ($1,$2,$3,$4,$5,true);`,
        [res.rows[0].id, img.dbxFilePath, img.publicUrl, img.type, img.isPrimary]
      );
    }

    console.log("inserted");

    await client.query("COMMIT");
    resp.status = "success";
  } catch (error) {
    await client.query("ROLLBACK");
    resp.error = error;
  } finally {
    client.release();
    console.log("finally", resp);
    return resp;
  }
};
