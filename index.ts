import { StringSchema } from './string.ts';
import { ObjectSchema } from './object.ts';

export type OkResult<T> = {
    ok: true;
    data: T;
}

export type ErrorResult = {
    ok: false;
    errors: string[];
}

export type Result<T> = OkResult<T> | ErrorResult;

export type Schema<T> = {
    parse: (input: unknown) => Result<T>;
};

export type SchemaOption<TInput, TOptions extends string> = {
    option: TOptions;
    check: (input: TInput) => boolean;
    message: string;
}


const g = {
    object: (...params: ConstructorParameters<typeof ObjectSchema>) => new ObjectSchema(...params),
    string: () => new StringSchema(),
}

const userSchema = g.object({
    name: g.string().min(4).max(128),
    password: g.string().min(8).max(128).regex(/^[a-zA-Z]*$/),
});

console.log(userSchema.parse({
    name: "test",
    password: "abcdABCD1"
}))
