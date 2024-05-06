import {WrongBodyError} from "@errors";
import {Schema} from "joi";

export function BodyValidator(schema: Schema) {
    return function (target: object, propertyKey: string, descriptor: PropertyDescriptor) {

        const originalValue = descriptor.value;
        descriptor.value = function(req, res, next) {
            const { error } = schema.validate(req.body);
            if (error) {
                return next(new WrongBodyError(error.message));
            }
            originalValue(req, res, next);
        }
    };
}
