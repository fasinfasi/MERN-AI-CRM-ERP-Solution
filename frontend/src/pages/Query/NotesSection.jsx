import { useEffect, useState } from 'react';
import { List, Input, Button, Popconfirm } from 'antd';
import { request } from '@/request';

export default function NotesSection({ queryId, initialNotes = [] }) {
  const [notes, setNotes] = useState(initialNotes);
  const [noteText, setNoteText] = useState('');

  const fetchNotes = async () => {
    const res = await request.get({ entity: `/api/query/read/${queryId}` });
    if (res.success) setNotes(res.result.notes || []);
  };

  useEffect(() => {
    if (queryId && initialNotes.length === 0) {
      fetchNotes();
    }
  }, [queryId, initialNotes]);

  const addNote = async () => {
    if (!noteText) return;
    const res = await request.post({
      entity: `/api/query/${queryId}/notes`,
      json: { text: noteText },
    });
    if (res.success) {
      setNoteText('');
      fetchNotes();
    }
  };

  const deleteNote = async (noteId) => {
    const res = await request.delete({
      entity: `/api/query/${queryId}/notes/${noteId}`,
    });
    if (res.success) fetchNotes();
  };

  return (
    <div>
      <Input.TextArea
        rows={2}
        value={noteText}
        onChange={e => setNoteText(e.target.value)}
        placeholder="Add a note"
      />
      <Button type="primary" onClick={addNote} style={{ marginTop: 8 }}>
        Add Note
      </Button>
      <List
        dataSource={notes}
        renderItem={note => (
          <List.Item
            actions={[
              <Popconfirm
                title="Delete this note?"
                onConfirm={() => deleteNote(note._id)}
                okText="Yes"
                cancelText="No"
              >
                <Button danger size="small">Delete</Button>
              </Popconfirm>
            ]}
          >
            <div>
              <div>{note.text}</div>
              <div style={{ fontSize: 12, color: '#888' }}>
                {note.created && new Date(note.created).toLocaleString()}
              </div>
            </div>
          </List.Item>
        )}
        style={{ marginTop: 16 }}
      />
    </div>
  );
}