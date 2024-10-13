const createDynamicSchema = (feilds) => {
  const schemaDefinition = {};
  feilds.foreach((feild) => {
    if (feild.feilds && feild.fields.length > 0) {
      schemaDefinition[feild.name] = {
        type: createDynamicSchema(feild.feilds),
        required: feild.required,
      };
    } else {
      schemaDefinition[feild.name] = {
        type: mongoose.Schema.Types[feild.type],
        required: feild.required,
      };
    }
  });
  return new mongoose.Schema(schemaDefinition);
};
module.exports = { createDynamicSchema };
