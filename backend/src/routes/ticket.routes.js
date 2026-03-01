const express = require('express');
const router = express.Router();
const ticketController = require('../controllers/ticket.controller');
const { authMiddleware } = require('../middlewares/auth.middleware');

router.use(authMiddleware);

router.get('/', ticketController.getAllTickets);
router.get('/:id', ticketController.getTicketById);
router.post('/', ticketController.createTicket);

module.exports = router;