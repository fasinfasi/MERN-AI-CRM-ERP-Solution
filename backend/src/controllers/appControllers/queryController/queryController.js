const Query = require('../../models/appModels/Query');

// GET /api/queries?page=&limit=
exports.list = async (req, res) => {
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
};

// POST /api/queries
exports.create = async (req, res) => {
  try {
    const query = new Query(req.body);
    await query.save();
    res.status(201).json({ success: true, result: query });
  } catch (err) {
    res.status(400).json({ success: false, error: err.message });
  }
};

// GET /api/queries/:id
exports.get = async (req, res) => {
  try {
    const query = await Query.findById(req.params.id).populate('customer', 'name');
    if (!query || query.removed) return res.status(404).json({ success: false, message: 'Not found' });
    res.json({ success: true, result: query });
  } catch (err) {
    res.status(400).json({ success: false, error: err.message });
  }
};

// PUT /api/queries/:id
exports.update = async (req, res) => {
  try {
    const query = await Query.findByIdAndUpdate(
      req.params.id,
      req.body,
      { new: true }
    );
    if (!query || query.removed) return res.status(404).json({ success: false, message: 'Not found' });
    res.json({ success: true, result: query });
  } catch (err) {
    res.status(400).json({ success: false, error: err.message });
  }
};

// POST /api/queries/:id/notes
exports.addNote = async (req, res) => {
  try {
    const query = await Query.findById(req.params.id);
    if (!query || query.removed) return res.status(404).json({ success: false, message: 'Not found' });
    query.notes.push(req.body);
    await query.save();
    res.json({ success: true, result: query });
  } catch (err) {
    res.status(400).json({ success: false, error: err.message });
  }
};

// DELETE /api/queries/:id/notes/:noteId
exports.deleteNote = async (req, res) => {
  try {
    const query = await Query.findById(req.params.id);
    if (!query || query.removed) return res.status(404).json({ success: false, message: 'Not found' });
    query.notes.id(req.params.noteId).remove();
    await query.save();
    res.json({ success: true, result: query });
  } catch (err) {
    res.status(400).json({ success: false, error: err.message });
  }
};