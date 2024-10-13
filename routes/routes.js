const express = require('express');
const { registerUser, updateUser, getUser } = require('../controllers/userController'); // Ajuste o caminho
const { createContact, updateContact, getContacts } = require('../controllers/contactController'); // Ajuste o caminho
const { createInteraction, getInteractions } = require('../controllers/interactionController'); // Ajuste o caminho
const { authenticateToken } = require('../middlewares/authMiddleware');
const { loginUser } = require('../controllers/authController'); 

const router = express.Router();

// Rota de Login
router.post('/login', loginUser); 

// Rotas de Usuário
router.post('/usuarios', registerUser);
router.put('/usuarios/:id', authenticateToken, updateUser);
router.get('/usuarios', getUser);

// Rotas de Contato
router.post('/contatos', authenticateToken, createContact);
router.put('/contatos/:id', authenticateToken, updateContact);
router.get('/contatos', authenticateToken, getContacts);

// Rotas de Interação
router.post('/interacoes', authenticateToken, createInteraction);
router.get('/interacoes', authenticateToken, getInteractions);

module.exports = router;
