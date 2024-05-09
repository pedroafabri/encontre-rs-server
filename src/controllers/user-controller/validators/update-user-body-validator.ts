import Joi, {Schema} from "joi";

export const UpdateUserBodyValidator : Schema = Joi.object({
    name: Joi.string().optional(),
    contacts: Joi.string().optional(),
})
