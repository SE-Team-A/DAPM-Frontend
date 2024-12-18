import { Dialog, DialogPanel, DialogTitle } from '@headlessui/react'
import CreateUserForm from "../createUser/createUserForm";
import CloseIcon from '@mui/icons-material/Close';
import { Repository } from '../../redux/states/apiState';
import { addPipelineExecution } from '../../services/backendAPI';
import toast from 'react-hot-toast';
import { useState } from 'react';

interface AddExecutionProps {
    openAddExecutionDialog: boolean;
    repos: Repository[];
    setOpenAddExecutionDialog: (value: boolean) => void;
    orgId: string;
    pId: string;
}

const AddMemberPopup: React.FC<AddExecutionProps> = ({ openAddExecutionDialog, repos, setOpenAddExecutionDialog, orgId, pId }) => {
    
    const [selectedRepo, setSelectedRepo] = useState(repos[0].id);

    const saveExecution = () => {
        addPipelineExecution(orgId, selectedRepo, pId).then(
            () => toast.success("Pipeline Execution Added!"),
            () => toast.error("An error has occured during processing your request."),
        );
    }

    return (
        <Dialog open={openAddExecutionDialog} onClose={() => setOpenAddExecutionDialog(false)} className="relative z-40 ">

            <div className="fixed inset-0 flex w-screen items-center justify-center sm:p-4 backdrop-blur-md ">
                <DialogPanel className="relative max-w-lg space-y-4 border  bg-[#121212] p-12 rounded sm:border-solid border-white border-none">
                    <CloseIcon onClick={() => setOpenAddExecutionDialog(false)} className="cursor-pointer absolute text-white right-5 top-5"></CloseIcon>

                    <DialogTitle className="font-bold text-white sm:text-3xl text-xl text-center ">Select target repository</DialogTitle>
                    
                    <div className='flex flex-col'>
                        <select
                            className="p-0 mb-20 cursor-pointer select priority-select  bg-transparent border-none focus:border-none text-white"
                            name="repo"
                            value={selectedRepo}
                            onChange={(e) => {setSelectedRepo(e.target.value)}}
                            aria-label="Project status"
                        >
                            {repos.map(r => <option className="bg-black" value={r.id}>{r.name}</option>)}
                        </select>

                        <button className={`px-2 py-1 w-24 bg-green-600 rounded-xl text-white text-sm`} onClick={e => {saveExecution()}}>Save</button>
                    </div>
                </DialogPanel>
            </div>
            
        </Dialog>

    )
}
export default AddMemberPopup;