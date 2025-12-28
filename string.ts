import { Result, Schema, SchemaOption } from './index.ts';

type StringOption = 'min' | 'max' | 'length' | 'regex';

export class StringSchema implements Schema<string> {
    private options: SchemaOption<string, StringOption>[] = [];

    constructor(options: typeof this.options = []) {
        this.options = options;
    }

    parse(input: unknown): Result<string> {
        if (typeof input !== 'string') {
            return {
                ok: false,
                errors: ["Input not of type string."],
            }
        }
        const errors: string[] = [];
        for (const option of this.options) {
            if (!option.check(input)) {
                errors.push(option.message);
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
            data: input
        }
    }

    min(length: number) {
        const options: typeof this.options = [
            ...this.options.filter((o) => o.option !== "min"),
            { option: "min", check: (input) => input.length >= length, message: `Input must be at least ${length} characters long.` }
        ];
        return new StringSchema(options);
    }

    max(length: number) {
        const options: typeof this.options = [
            ...this.options.filter((o) => o.option !== "max"),
            { option: "max", check: (input) => input.length <= length, message: `Input must be no more than ${length} characters long.` }
        ];
        return new StringSchema(options);
    }

    length(length: number) {
        const options: typeof this.options = [
            ...this.options.filter((o) => o.option !== "min" && o.option !== "max"),
            { option: "length", check: (input) => input.length === length, message: `Input must be exactly ${length} characters long.` }
        ]
        return new StringSchema(options);
    }

    regex(pattern: RegExp) {
        return new StringSchema(this.options.concat({ option: "regex", check: (input) => pattern.test(input), message: `Input does not match regex pattern.` }));
    }

}
