import { useEffect, useState } from 'react';
import { Table, Button, Tag, Select } from 'antd';
import { request } from '@/request';


export default function Query() {
  const [queries, setQueries] = useState([]);
  const [pagination, setPagination] = useState({ current: 1, pageSize: 10, total: 0 });
  const [loading, setLoading] = useState(false);
  const [status, setStatus] = useState('');

  const fetchQueries = async (page = 1, status = '') => {
    setLoading(true);
    let url = `/api/queries?page=${page}&limit=${pagination.pageSize}`;
    if (status) url += `&status=${status}`;
    const res = await request.get({ entity: url });
    if (res.success) {
      setQueries(res.result);
      setPagination({
        ...pagination,
        current: page,
        total: res.pagination.total,
      });
    }
    setLoading(false);
  };

  useEffect(() => {
    fetchQueries();
  }, []);

  const columns = [
    {
      title: 'Customer',
      dataIndex: ['customer', 'name'],
      key: 'customer',
    },
    {
      title: 'Description',
      dataIndex: 'description',
      key: 'description',
    },
    {
      title: 'Created',
      dataIndex: 'created',
      key: 'created',
      render: (date) => new Date(date).toLocaleDateString(),
    },
    {
      title: 'Status',
      dataIndex: 'status',
      key: 'status',
      render: (status) => <Tag>{status}</Tag>,
    },
    {
      title: 'Resolution',
      dataIndex: 'resolution',
      key: 'resolution',
      render: (text) => (text ? text.slice(0, 30) + (text.length > 30 ? '...' : '') : ''),
    },
    // Add actions column for view/edit later
  ];

  return (
    <div>
      <h1>Query Management</h1>
      <div style={{ marginBottom: 16 }}>
        <Select
          placeholder="Filter by status"
          style={{ width: 200, marginRight: 8 }}
          onChange={(value) => {
            setStatus(value);
            fetchQueries(1, value);
          }}
          allowClear
        >
          <Select.Option value="Open">Open</Select.Option>
          <Select.Option value="InProgress">InProgress</Select.Option>
          <Select.Option value="Closed">Closed</Select.Option>
        </Select>
        <Button type="primary" onClick={() => {/* open add query form */}}>Add Query</Button>
      </div>
      <Table
        columns={columns}
        dataSource={queries}
        rowKey="_id"
        loading={loading}
        pagination={{
          current: pagination.current,
          pageSize: pagination.pageSize,
          total: pagination.total,
          onChange: (page) => fetchQueries(page, status),
        }}
      />
    </div>
  );
}