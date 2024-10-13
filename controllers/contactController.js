const pool = require('../db');

const createContact = async (req, res) => {
    const { nome, email, telefone, cpf, usuario_criacao } = req.body;

    try {
        const result = await pool.query(
            'INSERT INTO contatos (nome, email, telefone, cpf, usuario_criacao) VALUES ($1, $2, $3, $4, $5) RETURNING *',
            [nome, email, telefone, cpf, usuario_criacao]
        );
        res.status(201).json(result.rows[0]);
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
};

const updateContact = async (req, res) => {
    const { id } = req.params;
    const { nome, email, telefone, cpf } = req.body;

    try {
        const result = await pool.query(
            'UPDATE contatos SET nome = COALESCE($1, nome), email = COALESCE($2, email), telefone = COALESCE($3, telefone), cpf = COALESCE($4, cpf) WHERE id = $5 RETURNING *',
            [nome, email, telefone, cpf, id]
        );

        if (result.rows.length === 0) {
            return res.status(404).json({ error: 'Contato não encontrado' });
        }

        res.json(result.rows[0]);
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
};

const getContacts = async (req, res) => {
    const { id, email } = req.query;

    try {
        let result;
        if (id) {
            result = await pool.query('SELECT * FROM contatos WHERE id = $1', [id]);
        } else if (email) {
            result = await pool.query('SELECT * FROM contatos WHERE email = $1', [email]);
        } else {
            result = await pool.query('SELECT * FROM contatos');
        }

        res.json(result.rows);
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
};

const createInteraction = async (req, res) => {
    const { contato, usuario, data_interacao, status } = req.body;

    try {
        const result = await pool.query(
            'INSERT INTO interacoes (contato, usuario, data_interacao, status) VALUES ($1, $2, $3, $4) RETURNING *',
            [contato, usuario, data_interacao, status]
        );
        res.status(201).json(result.rows[0]);
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
};

const getInteractions = async (req, res) => {
    const { contato, usuario } = req.query;

    try {
        let result;
        if (contato) {
            result = await pool.query('SELECT * FROM interacoes WHERE contato = $1', [contato]);
        } else if (usuario) {
            result = await pool.query('SELECT * FROM interacoes WHERE usuario = $1', [usuario]);
        } else {
            result = await pool.query('SELECT * FROM interacoes');
        }

        res.json(result.rows);
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
};

module.exports = {
    createContact,
    updateContact,
    getContacts,
    createInteraction,
    getInteractions,
};
