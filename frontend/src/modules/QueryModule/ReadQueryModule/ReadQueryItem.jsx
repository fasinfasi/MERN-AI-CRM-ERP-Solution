import { Button, Descriptions, Divider, Row, Col, Statistic, Tag } from 'antd';
import { PageHeader } from '@ant-design/pro-layout';
import { useSelector } from 'react-redux';
import { useNavigate } from 'react-router-dom';
import { useDispatch } from 'react-redux';
import { erp } from '@/redux/erp/actions';
import useLanguage from '@/locale/useLanguage';
import { generate as uniqueId } from 'shortid';
import { CloseCircleOutlined, EditOutlined } from '@ant-design/icons';
import { selectReadItem } from '@/redux/erp/selectors';
import NotesSection from '@/pages/Query/NotesSection';

export default function ReadQueryItem({ config }) {
  const translate = useLanguage();
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const { result: currentQuery, isLoading } = useSelector(selectReadItem);
  const { entity } = config;

  if (isLoading) return <div>Loading...</div>;
  if (!currentQuery) return <div>No query data found</div>;

  const getStatusColor = (status) => {
    switch (status) {
      case 'Open':
        return 'orange';
      case 'InProgress':
        return 'blue';
      case 'Closed':
        return 'green';
      default:
        return 'default';
    }
  };

  return (
    <>
      <PageHeader
        onBack={() => {
          navigate(`/${entity.toLowerCase()}`);
        }}
        title={`${translate('Query')} # ${currentQuery._id}`}
        ghost={false}
        tags={[
          <Tag key="status" color={getStatusColor(currentQuery.status)}>
            {translate(currentQuery.status)}
          </Tag>,
        ]}
        extra={[
          <Button
            key={`${uniqueId()}`}
            onClick={() => {
              navigate(`/${entity.toLowerCase()}`);
            }}
            icon={<CloseCircleOutlined />}
          >
            {translate('Close')}
          </Button>,
          <Button
            key={`${uniqueId()}`}
            onClick={() => {
              dispatch(
                erp.currentAction({
                  actionType: 'update',
                  data: currentQuery,
                })
              );
              navigate(`/${entity.toLowerCase()}/update/${currentQuery._id}`);
            }}
            type="primary"
            icon={<EditOutlined />}
          >
            {translate('Edit')}
          </Button>,
        ]}
        style={{
          padding: '20px 0px',
        }}
      >
        <Row>
          <Statistic 
            title={translate('Status')} 
            value={
              <Tag color={getStatusColor(currentQuery.status)}>
                {translate(currentQuery.status)}
              </Tag>
            } 
          />
          <Statistic
            title={translate('Created')}
            value={new Date(currentQuery.created).toLocaleDateString()}
            style={{
              margin: '0 32px',
            }}
          />
        </Row>
      </PageHeader>
      <Divider dashed />
      
      <Descriptions title={`${translate('Customer')} : ${currentQuery.customer?.name || (currentQuery.customer ? `ID: ${currentQuery.customer}` : 'N/A')}`}>
        <Descriptions.Item label={translate('Description')} span={3}>
          {currentQuery.description}
        </Descriptions.Item>
        {currentQuery.resolution && (
          <Descriptions.Item label={translate('Resolution')} span={3}>
            {currentQuery.resolution}
          </Descriptions.Item>
        )}
      </Descriptions>
      
      <Divider />
      
      <div style={{ marginTop: 24 }}>
        <h3>{translate('Notes')}</h3>
        <NotesSection queryId={currentQuery._id} initialNotes={currentQuery.notes || []} />
      </div>
    </>
  );
} 