/**
 * Author:
 * - Tamas Drabos
 */

import { useParams } from 'react-router-dom'
import BasicSidebar from '../components/common/BasicSidebar'
import { TopBar } from '../components/OverviewPage/TopBar';
import PipelineExecutionsTable from '../components/PipelineExecutions/PipelineExecutionsTable';

function PipelineExecutions() {
  const { orgId, repoId, pId } = useParams();

  return (
    <div className="flex w-full h-screen text-start">
      <div className='flex flex-col w-64'>
        <BasicSidebar />
      </div>
      <div className="flex flex-col flex-1 overflow-y-auto">
        <TopBar />
        <div className='py-4 px-20'>
          <h1 className="text-white text-xl font-bold mt-2">Executions for pipeline: {pId}</h1>
          <PipelineExecutionsTable 
            pid={pId as string}
            orgId={orgId as string}
            repId={repoId as string}
          />
        </div>
      </div>
    </div>
  )
}

export default PipelineExecutions