import Joi, {Schema} from "joi";

export const AuthenticateUserBodyValidator : Schema = Joi.object({
    idToken: Joi.string().required()
})
