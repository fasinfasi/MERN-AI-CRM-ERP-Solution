import dayjs from 'dayjs';
import { Tag } from 'antd';
import { tagColor } from '@/utils/statusTagColor';
import QueryDataTableModule from '@/modules/QueryModule/QueryDataTableModule';
import { useMoney, useDate } from '@/settings';
import useLanguage from '@/locale/useLanguage';

export default function Query() {
  const translate = useLanguage();
  const { dateFormat } = useDate();
  const entity = 'query';
  const { moneyFormatter } = useMoney();

  const searchConfig = {
    entity: 'client',
    displayLabels: ['name'],
    searchFields: 'name',
  };
  const deleteModalLabels = ['description', 'customer.name'];
  const dataTableColumns = [
    {
      title: translate('Customer'),
      dataIndex: ['customer', 'name'],
    },
    {
      title: translate('Description'),
      dataIndex: 'description',
      ellipsis: true,
    },
    {
      title: translate('Status'),
      dataIndex: 'status',
      render: (status) => (
        <Tag color={tagColor(status)}>{translate(status)}</Tag>
      ),
    },
    {
      title: translate('Created'),
      dataIndex: 'created',
      render: (date) => {
        return dayjs(date).format(dateFormat);
      },
    },
  ];

  const Labels = {
    PANEL_TITLE: translate('query'),
    DATATABLE_TITLE: translate('query_list'),
    ADD_NEW_ENTITY: translate('add_new_query'),
    ENTITY_NAME: translate('query'),
  };

  const configPage = {
    entity,
    ...Labels,
  };
  const config = {
    ...configPage,
    dataTableColumns,
    searchConfig,
    deleteModalLabels,
  };
  return <QueryDataTableModule config={config} />;
}