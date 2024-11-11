import toast from "react-hot-toast";
import { deletePipeline } from "../../../../services/backendAPI";

export const handleDeletePipeline = async (id: string, name: string) => {
  try {
    // const dispatch = useAppDispatch();

    const orgId = "d87bc490-828f-46c8-aa44-ded7729eaa82";
    const repoId = "fa6cf45e-b9f5-4dee-82b3-64fc1957a8fe";

    toast.success("Pipeline Deleted Successfully!");
    const deletedPipeline = await deletePipeline(orgId, repoId, id);
    console.log("deletedPipeline", deletedPipeline);
  } catch (error) {
    console.error("Error deleting pipeline:", error);
    // toast.error("An error occurred while deleting the pipeline.");
  }
};

export const handleUpdatePipeline = async (
  id: string,
  name: string,
  orgId: string,
  repoId: string
) => {
  try {
    toast.success("Pipeline Updated Successfully!");
  } catch (error) {
    console.error("Error deleting pipeline:", error);
    toast.error("An error occurred while deleting the pipeline.");
  }
};
