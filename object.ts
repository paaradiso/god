import { Result, Schema } from './index.ts';

type ObjectSchemaShape<T> = Record<string, Schema<T>>;

export class ObjectSchema<T> implements Schema<Record<string, T>> {
    private shape: ObjectSchemaShape<T>;

    constructor(shape: ObjectSchemaShape<T> = {}) {
        this.shape = shape;
    }

    parse(input: unknown): Result<Record<string, T>> {

        if (!(typeof input === 'object' && !Array.isArray(input) && input !== null)) {
            return {
                ok: false,
                errors: ['Input not of type object.']
            }
        }

        const errors: string[] = [];
        let result: Record<string, T> = {};

        for (const [key, schema] of Object.entries(this.shape)) {
            if (!(key in input)) {
                errors.push(`"${key}" is required in schema, but was not provided.`)
                continue;
            }
            const parsed = schema.parse(input[key]);
            if (!parsed.ok) {
                errors.push(...parsed.errors.map((error) => `${key}: ${error}`))
            } else {
                result[key] = parsed.data;
            }
        }

        if (errors.length > 0) {
            return {
                ok: false,
                errors
            }
        }

        return {
            ok: true,
            data: result
        };

    }
}
