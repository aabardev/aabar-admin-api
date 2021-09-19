export const addCategories = async (req, h) => {
    console.log(req.payload);

    const { title, desc, primary_image, other_images } = req.payload;
    // (1) Prep images
    // (1.1) Upload to dbx
    
    // (1.2) Get and modify shareable link


    return req.payload;
}