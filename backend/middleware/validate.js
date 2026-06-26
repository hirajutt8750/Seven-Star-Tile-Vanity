const validateOrder = (req, res, next) => {
  const { fullName, phone, altPhone, city, address } = req.body;

  if (!fullName || fullName.trim().length < 2) {
    return res.status(400).json({ message: "Full name is required." });
  }
  if (!phone || phone.trim().length < 10) {
    return res.status(400).json({ message: "Valid phone number is required." });
  }
  if (!altPhone || altPhone.trim().length < 10) {
    return res
      .status(400)
      .json({ message: "Valid alternate phone is required." });
  }
  if (!city || city.trim().length < 2) {
    return res.status(400).json({ message: "City is required." });
  }
  if (!address || address.trim().length < 5) {
    return res.status(400).json({ message: "Address is required." });
  }

  req.body.fullName = fullName.trim();
  req.body.phone = phone.trim();
  req.body.altPhone = altPhone.trim();
  req.body.city = city.trim();
  req.body.address = address.trim();

  next();
};

const validateProduct = (req, res, next) => {
  const { name, price, category, description } = req.body;

  if (!name || name.trim().length < 2) {
    return res.status(400).json({ message: "Product name is required." });
  }
  if (price === undefined || price === null || isNaN(price) || price < 0) {
    return res.status(400).json({ message: "Valid price is required." });
  }
  if (!category || category.trim().length < 2) {
    return res.status(400).json({ message: "Category is required." });
  }
  if (!description || description.trim().length < 5) {
    return res.status(400).json({ message: "Description is required." });
  }

  next();
};

module.exports = { validateOrder, validateProduct };
