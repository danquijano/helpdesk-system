const express = require('express');
const router = express.Router();
const ticketController = require('../controllers/ticket.controller');
const { authMiddleware, checkRole } = require('../middlewares/auth.middleware');

router.use(authMiddleware);

router.get('/', ticketController.getAllTickets);
router.get('/:id', ticketController.getTicketById);
router.post('/', ticketController.createTicket);
router.post('/:id/comments', ticketController.addComment);
router.patch('/:id/status', checkRole(['technician', 'admin']), ticketController.updateStatus);

module.exports = router;