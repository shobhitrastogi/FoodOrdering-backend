import userModel from "../models/userModel.js";

const addToCart = async (req, res) => {
  try {
    let userData = await userModel.findById(req.body.userId);
    if (!userData) {
      return res.status(404).json({ success: false, message: "User not found." });
    }

    let cartData = userData.cartData;
    if (!cartData[req.body.itemId]) {
      cartData[req.body.itemId] = 1;
    } else {
      cartData[req.body.itemId] += 1;
    }

    await userModel.findByIdAndUpdate(req.body.userId, { cartData });
    res.status(200).json({ success: true, message: "Added to the cart." });
  } catch (error) {
    console.log(error);
    res.status(500).json({ success: false, message: "Error adding to cart." });
  }
};

const removeFromCart = async (req, res) => {
  try {
    let userData = await userModel.findById(req.body.userId);
    if (!userData) {
      return res.status(404).json({ success: false, message: "User not found." });
    }

    let cartData = userData.cartData;
    if (cartData[req.body.itemId]) {
      cartData[req.body.itemId] -= 1;
      if (cartData[req.body.itemId] <= 0) {
        delete cartData[req.body.itemId];
      }

      await userModel.findByIdAndUpdate(req.body.userId, { cartData });
      res.status(200).json({ success: true, message: "Removed from the cart." });
    } else {
      res.status(404).json({ success: false, message: "Item not in cart." });
    }
  } catch (error) {
    console.log(error);
    res.status(500).json({ success: false, message: "Error removing from cart." });
  }
};

const getCart = async (req, res) => {
  try {
    let userData = await userModel.findById(req.body.userId);
    if (!userData) {
      return res.status(404).json({ success: false, message: "User not found." });
    }

    let cartData = userData.cartData;
    res.status(200).json({ success: true, cartData });
  } catch (error) {
    console.log(error);
    res.status(500).json({ success: false, message: "Error fetching cart data." });
  }
};

export { addToCart, removeFromCart, getCart };
