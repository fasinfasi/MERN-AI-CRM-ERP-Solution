import { Form, Input, Select } from 'antd';
import useLanguage from '@/locale/useLanguage';
import { useEffect, useState } from 'react';
import { request } from '@/request';

export default function QueryForm({ form, isUpdateForm = false }) {
  const translate = useLanguage();
  const [clients, setClients] = useState([]);

  useEffect(() => {
    async function fetchClients() {
      const res = await request.get({ entity: 'client/list' });
      if (res.success) setClients(res.result);
    }
    fetchClients();
  }, []);

  return (
    <>
      <Form.Item
        name="customer"
        label={translate('Customer')}
        rules={[
          {
            required: true,
            message: translate('Please select a customer'),
          },
        ]}
      >
        <Select
          showSearch
          placeholder={translate('Select customer')}
          optionFilterProp="children"
          filterOption={(input, option) =>
            option.children.toLowerCase().indexOf(input.toLowerCase()) >= 0
          }
        >
          {clients.map((client) => (
            <Select.Option key={client._id} value={client._id}>
              {client.name}
            </Select.Option>
          ))}
        </Select>
      </Form.Item>

      <Form.Item
        name="description"
        label={translate('Description')}
        rules={[
          {
            required: true,
            message: translate('Please enter description'),
          },
        ]}
      >
        <Input.TextArea rows={4} placeholder={translate('Enter query description')} />
      </Form.Item>

      <Form.Item
        name="status"
        label={translate('Status')}
        initialValue="Open"
        rules={[
          {
            required: true,
            message: translate('Please select status'),
          },
        ]}
      >
        <Select placeholder={translate('Select status')}>
          <Select.Option value="Open">{translate('Open')}</Select.Option>
          <Select.Option value="InProgress">{translate('In Progress')}</Select.Option>
          <Select.Option value="Closed">{translate('Closed')}</Select.Option>
        </Select>
      </Form.Item>

      <Form.Item
        name="resolution"
        label={translate('Resolution')}
      >
        <Input.TextArea rows={3} placeholder={translate('Enter resolution')} />
      </Form.Item>
    </>
  );
} 