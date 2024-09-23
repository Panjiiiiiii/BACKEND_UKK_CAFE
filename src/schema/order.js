const z = require("zod");

exports.dateSchema = z.object({
    startDate : z.string().refine((date) => !isNaN(Date.parse(date))),
    endDate: z.string().refine((date) => !isNaN(Date.parse(date))),
    order: z.enum(['asc', 'desc']).optional(),
})