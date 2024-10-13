const pool = require('../db');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const registerUser = async (req, res) => {
    const { nome, email, senha } = req.body;

    if (!nome || !email || !senha) {
        return res.status(400).json({ error: 'Nome, email e senha são obrigatórios' });
    }

    if (typeof nome !== 'string') {
        return res.status(400).json({ error: 'Nome deve ser uma string' });
    }

    if (typeof email !== 'string') {
        return res.status(400).json({ error: 'Email deve ser uma string' });
    }

    if (typeof senha !== 'string') {
        return res.status(400).json({ error: 'Senha deve ser uma string' });
    }

    try {
        const hashedPassword = await bcrypt.hash(senha, 10);

        const result = await pool.query(
            'INSERT INTO usuarios (nome, email, senha) VALUES ($1, $2, $3) RETURNING *',
            [nome, email, hashedPassword]
        );

        res.status(201).json(result.rows[0]);
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
};

const updateUser = async (req, res) => {
    const { id } = req.params;
    const { nome, email, senha, status } = req.body;

    if (!nome && !email && !senha && !status) {
        return res.status(400).json({ error: 'Pelo menos um campo deve ser atualizado' });
    }

    if (nome && typeof nome !== 'string') {
        return res.status(400).json({ error: 'Nome deve ser uma string' });
    }

    if (email && typeof email !== 'string') {
        return res.status(400).json({ error: 'Email deve ser uma string' });
    }

    if (senha && typeof senha !== 'string') {
        return res.status(400).json({ error: 'Senha deve ser uma string' });
    }

    try {
        const hashedPassword = senha ? await bcrypt.hash(senha, 10) : undefined;
        
        const result = await pool.query(
            'UPDATE usuarios SET nome = COALESCE($1, nome), email = COALESCE($2, email), senha = COALESCE($3, senha), status = COALESCE($4, status) WHERE id = $5 RETURNING *',
            [nome, email, hashedPassword, status, id]
        );

        if (result.rows.length === 0) {
            return res.status(404).json({ error: 'Usuário não encontrado' });
        }

        res.json(result.rows[0]);
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
};

const getUser = async (req, res) => {
    const { id, email } = req.query;

    try {
        let result;
        if (id) {
            result = await pool.query('SELECT * FROM usuarios WHERE id = $1', [id]);
        } else if (email) {
            result = await pool.query('SELECT * FROM usuarios WHERE email = $1', [email]);
        } else {
            result = await pool.query('SELECT * FROM usuarios');
        }

        res.json(result.rows);
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
};

module.exports = { registerUser, updateUser, getUser };

