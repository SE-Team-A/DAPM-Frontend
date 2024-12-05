/**
 * Author:
 * - Raihanullah Mehran
 */
import toast from "react-hot-toast";
import { deletePipeline } from "../../../../services/backendAPI";

export const handleDeletePipeline = async (
  id: string,
  name: string,
  orgId: string,
  repoId: string
) => {
  await toast
    .promise(deletePipeline(orgId, repoId, id), {
      loading: `Deleting pipeline ${name}...`,
      success: (deletedPipeline) => {
        if (deletedPipeline.pipelineId) {
          return `Pipeline with name: ${name} and ID: ${deletedPipeline.pipelineId} deleted successfully!`;
        }
        return `Pipeline ${name} deleted successfully!`;
      },
      error: `An error occurred while deleting the pipeline with ID: ${id}.`,
    })
    .catch((error) => {
      console.error("Error deleting pipeline:", error);
    });
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
