import type { Schema } from "mongoose";

/**
 * Applies the canonical API serialisation for a schema: `_id` -> `id`,
 * drops `__v`, and drops any additional sensitive fields (e.g. password
 * hashes) so they can never leak through `res.json(doc)`.
 */
export function applyJsonTransform(schema: Schema, omit: string[] = []): void {
  schema.set("toJSON", {
    virtuals: true,
    versionKey: false,
    transform(_doc, ret: Record<string, unknown>) {
      ret.id = String(ret._id);
      delete ret._id;
      for (const key of omit) {
        delete ret[key];
      }
      return ret;
    },
  });
}
