import mongoose, { Schema, Document, Model, SchemaDefinition, Query } from 'mongoose';

// Extend Mongoose's Query with your custom query function
interface ComplexSortQuery<T> extends Query<T[], T> {
  complexSort(sortStyle: string): Query<T[], T>;
}

// Define what kinds of methods can be passed into the schema
interface ExtraSettings {
  allowExtraFields?: boolean;
}

interface SaveAsThis extends Document {
  saveAs?(): Promise<void>;
}

// Generic function for creating a Mongoose model with extended behavior
export function db_object<T extends SaveAsThis>(
  name: string,
  propTypes: SchemaDefinition,
  methods: Record<string, (...args: any[]) => any>,
  extraSettings: ExtraSettings = {}
): Model<T> {

  const extraSchema: Record<string, any> = { strict: 'throw' };
  if (extraSettings.allowExtraFields) {
    delete extraSchema.strict;
  }

  const schema = new Schema<T>(propTypes, extraSchema);

  // Add pre-save hook if defined
  const saveAs = methods.saveAs;
  if (saveAs) {
    schema.pre('save', async function (next) {
      await saveAs.apply(this);
      next();
    });
    delete methods.saveAs;
  }

  // Add your custom query function
  schema.query.complexSort = function (this: ComplexSortQuery<T>, sortStyle: string) {
    let sortOption: Record<string, 1 | -1> = {};
    switch (sortStyle) {
      case 'name_asc':  sortOption = { name: 1 }; break;
      case 'name_desc': sortOption = { name: -1 }; break;
      case 'newest':    sortOption = { created: -1 }; break;
      case 'oldest':    sortOption = { created: 1 }; break;
      default:          sortOption = { created: -1 }; break;
    }
    return this.sort(sortOption);
  };

  // Assign all remaining methods as statics
  Object.assign(schema.statics, methods);

  return mongoose.models[name] as Model<T> || mongoose.model<T>(name, schema);
}
