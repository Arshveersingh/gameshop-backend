const { z } = require("zod");
const validateUserData = (req, res, next) => {
  const userSchema = z.object({
    email: z.string().email(),
    password: z.string().min(5),
    username: z.string().min(3),
  });
  const validationResult = userSchema.safeParse(req.body);
  if (!validationResult.success) {
    return res.status(400).json({ ...validationResult.error });
  }
  next();
};

module.exports = validateUserData;
