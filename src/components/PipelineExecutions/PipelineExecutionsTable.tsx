import React, { useEffect, useState } from 'react'
import { fetchPipelineExecutions } from '../../services/backendAPI';
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
import ExecutionLogPopup from './ExecutionLogPopup';
import ErrorPopup from './ErrorPopup';

type Props = {
    pid: string;
}

export interface PipelineExecution {
    id: string;
    name: string;
    status: 'Running' | 'Completed' | 'Error' | 'NotStarted';
    logs?: string;
    error?: string;
}

export const StatusIcon = (props: any) => {
    const { status } = props;

    switch(status) {
        case 'Completed': return <CheckCircleIcon color='success' />
        case 'Running': return <PendingIcon color='primary'/>
        case 'Error': return <ErrorIcon sx={{color: red[500]}}/>
        case 'NotStarted': return <NotStartedIcon />
        default: return <div></div>
    }
}

function PipelineExecutionsTable(props: Props) {
    const [executions, setExecutions] = useState<PipelineExecution[]>([]);
    const [logOpen, setLogOpen] = useState(false);
    const [errorOpen, setErrorOpen] = useState(false);

    const stopExecution = (id: string) => {
        // Needs backend
    };
    
    const startExecution = (id: string) => {
        // Needs backend
    };

    const addExecution = () => {
        // Needs backend
    };

    useEffect(() => {
        fetchPipelineExecutions(props.pid).then((resp) => setExecutions(resp));
    }, [])
    
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
                            key={ex.id}
                            className="text-center text-white p-2 table-header flex w-full  table-tr rounded  mt-2 drop-shadow-2xl"
                        >
                            <div className="table-row-item w-1/5">{ex.id}</div>
                            <div className="table-row-item w-1/5">
                                <Tooltip title={ex.status}>
                                    <div>
                                        <StatusIcon status={ex.status}/>
                                    </div>
                                </Tooltip>
                            
                            </div>
                            <div className="table-row-item w-1/5">
                                {
                                    ex.logs && (
                                    <Tooltip title="Show logs">
                                        <button onClick={() => setLogOpen(true)}>
                                            <LibraryBooksIcon />
                                            <ExecutionLogPopup
                                                open={logOpen}
                                                exId={ex.id}
                                                log={ex.logs}
                                                onClose={() => setLogOpen(false)}
                                            />
                                        </button>
                                    </Tooltip>)
                                }
                            </div>
                            <div className="table-row-item w-1/5">
                                {
                                    ex.error && (
                                    <Tooltip title="Show error">
                                        <button onClick={() => setErrorOpen(true)}>
                                            <AnnouncementIcon />
                                            <ErrorPopup
                                                open={errorOpen}
                                                exId={ex.id}
                                                error={ex.error}
                                                onClose={() => setErrorOpen(false)}
                                            />
                                        </button>
                                    </Tooltip>)
                                }
                            </div>
                            <div className="table-row-item w-1/5">
                                {
                                    ex.status === 'Running' && (
                                        <Tooltip title="Stop Execution">
                                            <button onClick={() => stopExecution(ex.id!)}>
                                                <StopIcon />
                                            </button>
                                        </Tooltip>
                                    )
                                    ||
                                    (ex.status === 'NotStarted' && (
                                        <Tooltip title="Start Execution">
                                            <button onClick={() => startExecution(ex.id!)}>
                                                <PlayCircleOutlineIcon />
                                            </button>
                                        </Tooltip>
                                    ))
                                    ||
                                    ((ex.status === 'Completed' || ex.status === 'Error') && (
                                        <Tooltip title="Rerun Execution">
                                            <button onClick={() => startExecution(ex.id!)}>
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
            <div className="flex mt-10">
                {
                    <button
                        onClick={() => addExecution()}
                        className='px-2 py-1 w-24 bg-green-600 rounded-xl text-white text-sm font-bold'>
                            New Execution
                    </button>
                }
            </div>

        </div>
    );
}

export default PipelineExecutionsTable