const pool = require('../db');

const createInteraction = async (req, res) => {
    const { contato, usuario, status } = req.body; 

    try {
        const result = await pool.query(
            'INSERT INTO contatos_interacoes (contato, usuario, status) VALUES ($1, $2, $3) RETURNING *',
            [contato, usuario, status]
        );
        res.status(201).json(result.rows[0]);
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
};

const getInteractions = async (req, res) => {
    const { id, contato, usuario } = req.query;

    try {
        let result;
        if (id) {
            result = await pool.query('SELECT * FROM contatos_interacoes WHERE id = $1', [id]);
        } else if (contato) {
            result = await pool.query('SELECT * FROM contatos_interacoes WHERE contato = $1', [contato]);
        } else if (usuario) {
            result = await pool.query('SELECT * FROM contatos_interacoes WHERE usuario = $1', [usuario]);
        } else {
            result = await pool.query('SELECT * FROM contatos_interacoes');
        }

        res.json(result.rows);
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
};

module.exports = { createInteraction, getInteractions };

