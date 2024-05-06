import Joi, {Schema} from "joi";

export const CreateUserBodyValidator : Schema = Joi.object({
    firebaseId: Joi.string().required(),
    email: Joi.string().email().required(),
    name: Joi.string().required(),
    contacts: Joi.string(),
})
