import { model, Schema } from 'mongoose';

const templateSchema = new Schema(
  {
    templateName: {
      type: String,
    },
    templateId: {
      type: String,
    },
    template: {
      type: String,
    },
  },
  {
    timestamps: true,
  }
);

const Template = model('Template', templateSchema);

export default Template;
