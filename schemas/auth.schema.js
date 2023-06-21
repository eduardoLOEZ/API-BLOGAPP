const z = require("zod")

const registerSchema = z.object({
    username: z.string({
        required_error: "Username is requerid"
    }),
    email: z
    .string({
        required_error: "Email is requerid"
    })
    .email({
        required_error: "Email is no valid"
    }),
    password: z
    .string({
        required_error: "Password is requerid"
    })
    .min(6,{
        required_error: " Password must be at least 6 characteres "
    })
})

const LoginSchema = z.object({
    email: z.string().email(),
    password: z.string().min(6)
})

module.exports ={ registerSchema, LoginSchema  }