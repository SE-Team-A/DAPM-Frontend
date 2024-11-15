/**
 * Author:
 * - Hussein Dirani s223518
 * 
 * Description:
 * Delete Member Dialog
 */
import { Dialog, DialogPanel, DialogTitle } from '@headlessui/react'
import CloseIcon from '@mui/icons-material/Close';
import { useAuth } from '../../auth/authProvider';
import HighlightOffIcon from '@mui/icons-material/HighlightOff';

interface DeleteMemberPopupProps {
    openDeleteMemberPopup: boolean;
    setOpenDeleteMemberPopup: (value: boolean) => void;
    id: string;
    handleDelete: (id: string) => void;
}


const DeleteMemberPopup: React.FC<DeleteMemberPopupProps> = ({ openDeleteMemberPopup, setOpenDeleteMemberPopup, id, handleDelete }) => {
    const user = useAuth();


    return (
        <Dialog open={openDeleteMemberPopup} onClose={() => setOpenDeleteMemberPopup(false)} className="relative z-40 ">

            <div className="fixed inset-0 flex w-screen items-center justify-center sm:p-4 backdrop-blur-md 
            ">
                <DialogPanel className="relative max-w-lg space-y-4 border  bg-[#121212] px-20 py-6 rounded sm:border-solid border-white border-none">
                    {/* <CloseIcon onClick={() => setOpenDeleteMemberPopup(false)} className="cursor-pointer absolute text-white right-5 top-5"></CloseIcon> */}
                    <div className='flex justify-center w-full'>

                    <HighlightOffIcon style={{fontSize:80}} className='text-center text-red-500'></HighlightOffIcon>
                    </div>
                    <DialogTitle className="font-bold text-white sm:text-3xl text-xl text-center ">Are you sure?</DialogTitle>
                    <h3 className='text-[#959595] w-full text-center'>Do you really want to delete this records?This process cannot be undone</h3>
                    <div className="w-full flex justify-center mt-6 h-fit text-white">
                        <button onClick={() => { setOpenDeleteMemberPopup(false) }} className="text-white text-base p-2 px-12  bg-[#959595] mr-1">Cancel</button>
                        <div onClick={()=>{handleDelete(id); }} className="text-white text-base  p-2 px-12 bg-red-600 cursor-pointer text-center">Delete</div>
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