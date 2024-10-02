import { Dialog, DialogPanel, DialogTitle } from '@headlessui/react'
import CreateUserForm from './createUserForm';
import CloseIcon from '@mui/icons-material/Close';


interface AddMemberPopupProps {
    openAddMemberPopup: boolean;
    setOpenAddMemberPopup: (value: boolean) => void;
}


const AddMemberPopup: React.FC<AddMemberPopupProps> = ({ openAddMemberPopup, setOpenAddMemberPopup }) => {
    // const auth=useAuth();


    return (
        <Dialog open={openAddMemberPopup} onClose={() => setOpenAddMemberPopup(false)} className="relative z-50 ">

            <div className="fixed inset-0 flex w-screen items-center justify-center sm:p-4 backdrop-blur-md 
            ">
                <DialogPanel className="relative max-w-lg space-y-4 border  bg-[#121212] p-12 rounded sm:border-solid border-white border-none">
                    <CloseIcon onClick={() => setOpenAddMemberPopup(false)} className="cursor-pointer absolute text-white right-5 top-5"></CloseIcon>

                    <DialogTitle className="font-bold text-white sm:text-3xl text-xl text-center ">Add Member</DialogTitle>
                    <CreateUserForm setOpenAddMemberPopup={setOpenAddMemberPopup} ></CreateUserForm>
                </DialogPanel>
            </div>
        </Dialog>

    )
}
export default AddMemberPopup;