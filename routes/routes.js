const express = require('express');
const { registerUser, updateUser, getUser } = require('../controllers/userController'); 
const { createContact, updateContact, getContacts } = require('../controllers/contactController'); 
const { createInteraction, getInteractions } = require('../controllers/interactionController'); 
const { authenticateToken } = require('../middlewares/authMiddleware');
const { loginUser } = require('../controllers/authController'); 
const { validateContact } = require('../middlewares/validation'); 

const router = express.Router();

// Rota de Login
router.post('/login', loginUser); 

// Rotas de Usuário
router.post('/usuarios', registerUser);
router.put('/usuarios/:id', authenticateToken, updateUser);
router.get('/usuarios', authenticateToken, getUser); 
// Rotas de Contato
router.post('/contatos', authenticateToken, validateContact, createContact); 
router.put('/contatos/:id', authenticateToken, validateContact, updateContact); 
router.get('/contatos', authenticateToken, getContacts);

// Rotas de Interação
router.post('/interacoes', authenticateToken, createInteraction);
router.get('/interacoes', authenticateToken, getInteractions);

module.exports = router;
