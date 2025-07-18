const express = require('express');
const router = express.Router();
const queryController = require('../../controllers/appControllers/queryController/queryController');

// List queries (paginated)
router.get('/', queryController.list);

// Create a new query
router.post('/', queryController.create);

// Get a single query by ID
router.get('/:id', queryController.get);

// Update a query
router.put('/:id', queryController.update);

// Add a note to a query
router.post('/:id/notes', queryController.addNote);

// Delete a note from a query
router.delete('/:id/notes/:noteId', queryController.deleteNote);

module.exports = router;