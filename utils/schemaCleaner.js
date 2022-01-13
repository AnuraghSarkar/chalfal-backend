const schemaCleaner = (schema) => {
  schema.set("toJSON", {
    transform: (doc, ret, options) => {
      ret.id = ret._id.toString();
      delete ret.__v;
      delete ret._id;
      delete ret.passwordHash;
    },
  });
};
module.exports = schemaCleaner;
