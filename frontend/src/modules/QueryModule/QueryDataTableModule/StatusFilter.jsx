import { Select } from 'antd';
import { useDispatch } from 'react-redux';
import { erp } from '@/redux/erp/actions';
import useLanguage from '@/locale/useLanguage';

const { Option } = Select;

export default function StatusFilter({ entity }) {
  const translate = useLanguage();
  const dispatch = useDispatch();

  const handleStatusChange = (status) => {
    if (status) {
      const options = { filter: 'status', equal: status };
      dispatch(erp.list({ entity, options }));
    } else {
      // Clear filter - load all queries
      dispatch(erp.list({ entity }));
    }
  };

  return (
    <Select
      placeholder={translate('Filter by status')}
      style={{ width: 150, marginRight: 8 }}
      onChange={handleStatusChange}
      allowClear
    >
      <Option value="Open">{translate('Open')}</Option>
      <Option value="InProgress">{translate('In Progress')}</Option>
      <Option value="Closed">{translate('Closed')}</Option>
    </Select>
  );
} 