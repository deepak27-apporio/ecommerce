import Joi from "joi";

export const orderSchema = Joi.object({
  addressId: Joi.number().optional(),
  tax: Joi.number().required(),
  shipping: Joi.number().required(),

  address: Joi.object({
    fullName: Joi.string().required(),
    phone: Joi.string().required(),
    line1: Joi.string().required(),
    line2: Joi.string().allow("", null),
    city: Joi.string().required(),
    state: Joi.string().required(),
    pincode: Joi.string().required(),
  }).optional(),

  items: Joi.array()
    .items(
      Joi.object({
        productId: Joi.number().required(),
        productName: Joi.string().required(),
        attachments: Joi.array().required(),
        productCategory: Joi.string().required(),
        quantity: Joi.number().min(1).required(),
        price: Joi.number().required(),
      }),
    )
    .min(1)
    .required(),
}).custom((value: any, helpers: any) => {
  if (!value.addressId && !value.address) {
    return helpers.error("any.custom", {
      message: "Either addressId or address is required",
    });
  }

  if (value.addressId && value.address) {
    return helpers.error("any.custom", {
      message: "Send either addressId OR address, not both",
    });
  }

  return value;
});
