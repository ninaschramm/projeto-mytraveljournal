import { Request, Response, NextFunction } from "express";
import { wrongSchemaError } from "utils/errorUtils";
import Joi from "joi";

export function validateSchema(schema: Joi.ObjectSchema<any>) {
    return (req: Request, res: Response, next: NextFunction) => {
        const { error } = schema.validate(req.body, { abortEarly: false });
        if (error) {
            return res.status(422).send(error.details.map(detail => detail.message));
        }

        next();
    }
}

export function verifySchema(...args: string[]) {
    args.map((e) =>
    {
        if (!e) {
            throw wrongSchemaError("Looks like something is missing");
        }
    })
}
