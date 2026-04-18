import itemModal from "../modals/itemModal.js";

export const createItem = async (req, res, next) => {
    try {
        const { name, description, category, price, rating, hearts } = req.body;
        const imageUrl = req.file ? req.file.path : "";
        

        const total = Number(price) * 1;

        const newItem = new itemModal({
            name, 
            description,
            category,
            price,
            rating,
            hearts,
            imageUrl,
            total,
        })

        const saved = await newItem.save();
        res.status(201).json(saved)
    } 
    catch (err) {
        if ( err.code === 11000 ) {
            res.status(400).json({ message: "Item dengan nama ini sudah ada." });
        }
    }
}

// GET FUNCTION TO GET ALL ITEMS
export const getItems = async (_req,res,next) => {
    try {
        const items = await itemModal.find().sort({createdAt: -1});

        const withFullUrl = items.map(i => ({
            ...i.toObject(),
            imageUrl: i.imageUrl || '',
        }))
        res.json(withFullUrl);
    } 
    catch (error) {
        next(error);
    }
}

// DELETE FUNCTION TO DELETE ITEM BY ID
export const deleteItem = async (req, res, next) => {
    try {
        const removed = await itemModal.findByIdAndDelete(req.params.id);
        if(!removed) return res.status(404).json({ message: "Item tidak ditemukan." })
            res.status(200).end();
    } 
    catch (err) {
        next(err);
    }
}

// UPDATE PRICE FUNCTION
export const updateItemPrice = async (req, res, next) => {
    try {
        const { price } = req.body;
        if (price === undefined || isNaN(Number(price)) || Number(price) < 0) {
            return res.status(400).json({ message: "Harga tidak valid." });
        }
        const updated = await itemModal.findByIdAndUpdate(
            req.params.id,
            { price: Number(price) },
            { new: true }
        );
        if (!updated) return res.status(404).json({ message: "Item tidak ditemukan." });
        res.status(200).json(updated);
    }
    catch (err) {
        next(err);
    }
}