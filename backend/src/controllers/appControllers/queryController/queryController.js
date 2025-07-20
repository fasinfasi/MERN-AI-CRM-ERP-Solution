const Query = require('../../../models/appModels/Query');
const createCRUDController = require('@/controllers/middlewaresControllers/createCRUDController');

// Use the standard CRUD controller as base
const crudController = createCRUDController('Query');

// Extend with custom methods for Query-specific functionality
const queryController = {
  ...crudController,
  
  // Override create to add debugging
  create: async (req, res) => {
    try {
      console.log('Creating query with data:', req.body);
      console.log('Request body keys:', Object.keys(req.body));
      console.log('Customer field:', req.body.customer);
      console.log('Description field:', req.body.description);
      console.log('Status field:', req.body.status);
      
      // Validate required fields
      if (!req.body.customer) {
        return res.status(400).json({ 
          success: false, 
          error: 'Customer is required' 
        });
      }
      
      if (!req.body.description) {
        return res.status(400).json({ 
          success: false, 
          error: 'Description is required' 
        });
      }
      
      const query = new Query(req.body);
      await query.save();
      console.log('Query created:', query);
      res.status(201).json({ success: true, result: query });
    } catch (err) {
      console.log('Error creating query:', err);
      console.log('Error details:', err.errors);
      
      if (err.name === 'ValidationError') {
        const errorMessages = Object.values(err.errors).map(e => e.message);
        return res.status(400).json({ 
          success: false, 
          error: errorMessages.join(', ') 
        });
      }
      
      res.status(400).json({ success: false, error: err.message });
    }
  },
  
  // Override list to include customer population and filtering
  list: async (req, res) => {
    const page = parseInt(req.query.page) || 1;
    const limit = parseInt(req.query.limit) || 10;
    const skip = (page - 1) * limit;
    
    console.log('List query params:', req.query);
    console.log('Filter:', req.query.filter);
    console.log('Equal:', req.query.equal);

    let queryFilter = { removed: false };
    
    // Add status filter if provided
    if (req.query.filter === 'status' && req.query.equal) {
      queryFilter.status = req.query.equal;
      console.log('Applied status filter:', queryFilter);
    }

    const [queries, total] = await Promise.all([
      Query.find(queryFilter)
        .populate('customer', 'name')
        .sort({ created: -1 })
        .skip(skip)
        .limit(limit),
      Query.countDocuments(queryFilter)
    ]);

    console.log('Found queries:', queries.length);
    console.log('Total count:', total);

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
      const query = await Query.findById(req.params.id).populate('customer', 'name email phone');
      console.log('Query result:', query);
      console.log('Customer field:', query?.customer);
      if (!query || query.removed) {
        return res.status(404).json({ success: false, message: 'Not found' });
      }
      res.json({ success: true, result: query });
    } catch (err) {
      console.log('Error in custom read method:', err);
      res.status(400).json({ success: false, error: err.message });
    }
  },

  // Override update to add debugging
  update: async (req, res) => {
    try {
      console.log('Updating query with data:', req.body);
      console.log('Query ID:', req.params.id);
      console.log('Request body keys:', Object.keys(req.body));
      
      const result = await Query.findOneAndUpdate(
        {
          _id: req.params.id,
          removed: false,
        },
        req.body,
        {
          new: true,
          runValidators: true,
        }
      ).populate('customer', 'name email phone');
      
      if (!result) {
        return res.status(404).json({
          success: false,
          result: null,
          message: 'No document found',
        });
      }
      
      console.log('Query updated:', result);
      return res.status(200).json({
        success: true,
        result,
        message: 'Query updated successfully',
      });
    } catch (err) {
      console.log('Error updating query:', err);
      console.log('Error details:', err.errors);
      
      if (err.name === 'ValidationError') {
        const errorMessages = Object.values(err.errors).map(e => e.message);
        return res.status(400).json({ 
          success: false, 
          error: errorMessages.join(', ') 
        });
      }
      
      res.status(400).json({ success: false, error: err.message });
    }
  },

  // Override delete to add debugging
  delete: async (req, res) => {
    try {
      console.log('Deleting query with ID:', req.params.id);
      
      const result = await Query.findOneAndUpdate(
        {
          _id: req.params.id,
        },
        { $set: { removed: true } },
        {
          new: true,
        }
      ).exec();
      
      console.log('Delete result:', result);
      
      if (!result) {
        return res.status(404).json({
          success: false,
          result: null,
          message: 'No document found',
        });
      } else {
        return res.status(200).json({
          success: true,
          result,
          message: 'Successfully Deleted the document',
        });
      }
    } catch (err) {
      console.log('Error deleting query:', err);
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