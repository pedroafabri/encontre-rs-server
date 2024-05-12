import {InvalidFileTypeError} from "../errors/invalid-file-type-error";

const whitelist = [
    'image/png',
    'image/jpeg',
    'image/jpg',
    'image/webp'
]

export const fileFilter = (_: Express.Request, file: Express.Multer.File, cb: (arg0: Error, arg1?: boolean) => void) => {
    if (!whitelist.includes(file.mimetype)) {
        return cb(new InvalidFileTypeError('file is not allowed'))
    }

    cb(null, true)
}
