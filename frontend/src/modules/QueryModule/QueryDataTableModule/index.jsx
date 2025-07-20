import { ErpLayout } from '@/layout';
import ErpPanel from '@/modules/ErpPanelModule';
import DataTable from '@/modules/ErpPanelModule/DataTable';
import DeleteItem from '@/modules/ErpPanelModule/DeleteItem';
import StatusFilter from './StatusFilter';

export default function QueryDataTableModule({ config }) {
  const { entity } = config;
  
  return (
    <ErpLayout>
      <DataTable 
        config={config} 
        extra={[
          <StatusFilter key="statusFilter" entity={entity} />
        ]}
      />
      <DeleteItem config={config} />
    </ErpLayout>
  );
} 