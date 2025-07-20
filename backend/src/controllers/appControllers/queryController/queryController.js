const Query = require('../../../models/appModels/Query');
const createCRUDController = require('@/controllers/middlewaresControllers/createCRUDController');

// Use the standard CRUD controller as base
const crudController = createCRUDController('Query');

// Extend with custom methods for Query-specific functionality
const queryController = {
  ...crudController,
  
  // Override list to include customer population
  list: async (req, res) => {
    const page = parseInt(req.query.page) || 1;
    const limit = parseInt(req.query.limit) || 10;
    const skip = (page - 1) * limit;

    const [queries, total] = await Promise.all([
      Query.find({ removed: false })
        .populate('customer', 'name')
        .sort({ created: -1 })
        .skip(skip)
        .limit(limit),
      Query.countDocuments({ removed: false })
    ]);

    res.json({
      success: true,
      result: queries,
      pagination: {
        total,
        page,
        pages: Math.ceil(total / limit)
      }
    });
  },

  // Override read to include customer population
  read: async (req, res) => {
    try {
      console.log('Custom read method called for query:', req.params.id);
      const query = await Query.findById(req.params.id).populate('customer', 'name');
      console.log('Query result:', query);
      if (!query || query.removed) {
        return res.status(404).json({ success: false, message: 'Not found' });
      }
      res.json({ success: true, result: query });
    } catch (err) {
      console.log('Error in custom read method:', err);
      res.status(400).json({ success: false, error: err.message });
    }
  },

  // Add note to a query
  addNote: async (req, res) => {
    try {
      const query = await Query.findById(req.params.id);
      if (!query || query.removed) {
        return res.status(404).json({ success: false, message: 'Not found' });
      }
      query.notes.push(req.body);
      await query.save();
      res.json({ success: true, result: query });
    } catch (err) {
      res.status(400).json({ success: false, error: err.message });
    }
  },

  // Delete note from a query
  deleteNote: async (req, res) => {
    try {
      const query = await Query.findById(req.params.id);
      if (!query || query.removed) {
        return res.status(404).json({ success: false, message: 'Not found' });
      }
      query.notes.id(req.params.noteId).remove();
      await query.save();
      res.json({ success: true, result: query });
    } catch (err) {
      res.status(400).json({ success: false, error: err.message });
    }
  }
};

module.exports = queryController;