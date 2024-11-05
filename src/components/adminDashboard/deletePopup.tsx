/**
 * Author:
 * - Mahdi El Dirani
 * 
 * Description:
 * Add Member Dialog
 */
import { Dialog, DialogPanel, DialogTitle } from '@headlessui/react'
import CloseIcon from '@mui/icons-material/Close';
import { useAuth } from '../../auth/authProvider';


interface DeleteMemberPopupProps {
    openDeleteMemberPopup: boolean;
    setOpenDeleteMemberPopup: (value: boolean) => void;
}


const DeleteMemberPopup: React.FC<DeleteMemberPopupProps> = ({ openDeleteMemberPopup, setOpenDeleteMemberPopup }) => {
    const user = useAuth();
    console.log(user?.loadingRegister)

    const handleDelete = () => { }

    return (
        <Dialog open={openDeleteMemberPopup} onClose={() => setOpenDeleteMemberPopup(false)} className="relative z-40 ">

            <div className="fixed inset-0 flex w-screen items-center justify-center sm:p-4 backdrop-blur-md 
            ">
                <DialogPanel className="relative max-w-lg space-y-4 border  bg-[#121212] px-12 py-8 rounded sm:border-solid border-white border-none">
                    {/* <CloseIcon onClick={() => setOpenDeleteMemberPopup(false)} className="cursor-pointer absolute text-white right-5 top-5"></CloseIcon> */}

                    <DialogTitle className="font-bold text-white sm:text-3xl text-xl text-center ">Delete Member</DialogTitle>
                    <h3 className='text-white w-full text-center'>Are u sure u want to delete?</h3>
                    <div className="w-full flex justify-center mt-6 h-fit text-white">
                        <button onClick={() => { setOpenDeleteMemberPopup(false) }} className="text-white text-base sm:w-fit w-full sm:p-1 p-2 px-6  bg-[#8758ff] mr-1">Cancel</button>
                        <div onClick={handleDelete} className="text-white text-base sm:w-fit w-full sm:p-1 p-2 px-6 bg-red-600 cursor-pointer text-center">Delete</div>
                    </div>

                    {/* {user?.loadingRegister &&
                <div className="z-50 flex justify-center items-center absolute top-0 left-0 h-full w-full backdrop-blur-sm  px-12 py-8 sm:border-6 border-white sm:rounded-xl">
                    <div className="loader "></div>
                </div>

                } */}
                </DialogPanel>
            </div>

        </Dialog>

    )
}
export default DeleteMemberPopup;