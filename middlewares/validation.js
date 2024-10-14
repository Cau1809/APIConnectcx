// validation.js
const Joi = require('joi');

const contactSchema = Joi.object({
    nome: Joi.string().max(100).required(),
    email: Joi.string().email().max(100).required(),
    telefone: Joi.string().max(15).optional().allow(''), 
    cpf: Joi.string().length(11).required(),
});

const validateContact = (req, res, next) => {
    const { error } = contactSchema.validate(req.body);
    if (error) {
        return res.status(400).json({ error: error.details[0].message });
    }
    next();
};

module.exports = {
    validateContact,
};
