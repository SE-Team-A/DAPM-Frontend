import React, { useEffect, useState } from 'react'
import { fetchPipelineExecutions, addPipelineExecution } from '../../services/backendAPI';
import CheckCircleIcon from '@mui/icons-material/CheckCircle';
import ErrorIcon from '@mui/icons-material/Error';
import PendingIcon from '@mui/icons-material/Pending';
import NotStartedIcon from '@mui/icons-material/NotStarted';
import { Tooltip } from '@mui/material';
import LibraryBooksIcon from '@mui/icons-material/LibraryBooks';
import AnnouncementIcon from '@mui/icons-material/Announcement';
import PlayCircleOutlineIcon from '@mui/icons-material/PlayCircleOutline';
import StopIcon from '@mui/icons-material/Stop';
import RestartAltIcon from '@mui/icons-material/RestartAlt';
import { red } from '@mui/material/colors';
import toast from 'react-hot-toast';

type Props = {
    pid: string;
    orgId: string;
    repId: string;
}

export interface PipelineExecution {
    executionId: string;
    state: 'Running' | 'Completed' | 'Error' | 'Not Started';
    logs?: string;
    error?: string;
}

export const StatusIcon = (props: any) => {
    const { status } = props;

    switch(status) {
        case 'Completed': return <CheckCircleIcon color='success' />
        case 'Running': return <PendingIcon color='primary'/>
        case 'Error': return <ErrorIcon sx={{color: red[500]}}/>
        case 'Not Started': return <NotStartedIcon />
        default: return <div></div>
    }
}

const openLogPopup = (logs: string) => {

};

const stopExecution = (id: string) => {

};

const startExecution = (id: string) => {

};

function PipelineExecutionsTable(props: Props) {
    const [executions, setExecutions] = useState<PipelineExecution[]>([]);
    const [logOpen, setLogOpen] = useState(false);
    const [selectedLog, setSelectedLog] = useState('');

    useEffect(() => {
        fetchPipelineExecutions(props.orgId, props.repId, props.pid).then((resp) => {
            console.log(resp)
            setExecutions(resp);
        });
    }, [])
    

    const newExecution = () => {
        addPipelineExecution(props.orgId, props.repId, props.pid).then(
            () => toast.success("Pipeline Execution Added!"),
            () => toast.error("An error has occured during processing your request.")
        )
    };

    return (
        <div className="mt-10">
            <div className="my-table flex flex-wrap w-full ">
                <div className="text-center text-white p-2 table-header flex w-full bg-[#292929] border-2 rounded border-white">
                    <div className="table-header-item w-1/5">Execution ID</div>
                    <div className="table-header-item w-1/5">Status</div>
                    <div className="table-header-item w-1/5">Logs</div>
                    <div className="table-header-item w-1/5">Error message</div>
                    <div className="table-header-item w-1/5">Actions</div>
                </div>
                <div className="table-body w-full ">
                    {executions.length ? executions.map((ex) => (
                        <div 
                            key={ex.executionId}
                            className="text-center text-white p-2 table-header flex w-full  table-tr rounded  mt-2 drop-shadow-2xl"
                        >
                            <div className="table-row-item w-1/5">{ex.executionId}</div>
                            <div className="table-row-item w-1/5">
                                <Tooltip title={ex.state}>
                                    <div>
                                        <StatusIcon status={ex.state}/>
                                    </div>
                                </Tooltip>
                            
                            </div>
                            <div className="table-row-item w-1/5">
                                {
                                    ex.logs && (
                                    <Tooltip title="Show logs">
                                        <button onClick={() => openLogPopup(ex.logs!)}>
                                            <LibraryBooksIcon />
                                        </button>
                                    </Tooltip>)
                                }
                            </div>
                            <div className="table-row-item w-1/5">
                                {
                                    ex.error && (
                                    <Tooltip title="Show error">
                                        <button onClick={() => openLogPopup(ex.error!)}>
                                            <AnnouncementIcon />
                                        </button>
                                    </Tooltip>)
                                }
                            </div>
                            <div className="table-row-item w-1/5">
                                {
                                    ex.state === 'Running' && (
                                        <Tooltip title="Stop Execution">
                                            <button onClick={() => stopExecution(ex.executionId!)}>
                                                <StopIcon />
                                            </button>
                                        </Tooltip>
                                    )
                                    ||
                                    (ex.state === 'Not Started' && (
                                        <Tooltip title="Start Execution">
                                            <button onClick={() => startExecution(ex.executionId!)}>
                                                <PlayCircleOutlineIcon />
                                            </button>
                                        </Tooltip>
                                    ))
                                    ||
                                    ((ex.state === 'Completed' || ex.state === 'Error') && (
                                        <Tooltip title="Rerun Execution">
                                            <button onClick={() => startExecution(ex.executionId!)}>
                                                <RestartAltIcon />
                                            </button>
                                        </Tooltip>
                                    ))
                                }
                            </div>
                            
                            
                        </div>
                    )) : (
                        <div className="table-row  w-full">
                            <div className="table-row-item w-full text-center">Loading...</div>
                        </div>
                    )}
                </div>
            </div>
            <div className="flex justify-end mt-2">
                <button
                    onClick={() => newExecution()}
                    className={`px-2 py-1 w-24 bg-green-600 rounded-xl text-white text-sm`}>New execution</button>
            </div>

        </div>
    );
}

export default PipelineExecutionsTable