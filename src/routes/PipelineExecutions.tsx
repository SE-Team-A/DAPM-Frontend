import { useParams } from 'react-router-dom'
import BasicSidebar from '../components/common/BasicSidebar'
import { TopBar } from '../components/OverviewPage/TopBar';
import PipelineExecutionsTable from '../components/PipelineExecutions/PipelineExecutionsTable';

function PipelineExecutions() {
  const { id } = useParams();

  return (
    <div className="flex w-full h-screen text-start">
      <div className='flex flex-col w-64'>
        <BasicSidebar />
      </div>
      <div className="flex flex-col flex-1 overflow-y-auto">
        <TopBar />
        <div className='py-4 px-20'>
          <h1 className="text-white text-xl font-bold mt-2">Executions for pipeline: {id}</h1>
          <PipelineExecutionsTable pid={id as string}/>
        </div>
      </div>
    </div>
  )
}

export default PipelineExecutions