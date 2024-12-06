/**
 * Author:
 * - Raihanullah Mehran
 */
import { toast } from "react-hot-toast";
import { useAppDispatch } from "../../../hooks";
import { resourceThunk } from "../../../redux/slices/apiSlice";
import { putOperator } from "../../../services/backendAPI";
import { useSelector } from "react-redux";
import {
  getOrganizations,
  getRepositories,
} from "../../../redux/selectors/apiSelector";

export const useHandleOperatorSubmit = (
  orgId: string,
  repId: string,
  handleClose: () => void,
  selectedSourceFile: File | null,
  selectedDockerFile: File | null,
  resetFileStates: () => void
) => {
  const dispatch = useAppDispatch();
  const organizations = useSelector(getOrganizations);
  const repositories = useSelector(getRepositories);

  const handleSubmit = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();

    if (!selectedSourceFile || !selectedDockerFile) {
      toast.error("Both files are required.");
      return;
    }

    const formData = new FormData(event.currentTarget);
    formData.append("SourceCodeFile", selectedSourceFile);
    formData.append("DockerfileFile", selectedDockerFile);
    formData.append("ResourceType", "operator");

    toast
      .promise(putOperator(orgId, repId, formData), {
        loading: "Uploading...",
        success: <b>Resource successfully uploaded!</b>,
        error: <b>Failed to upload resource.</b>,
      })
      .then(() => {
        handleClose();
        dispatch(resourceThunk({ organizations, repositories }));
        resetFileStates();
        event.currentTarget.reset();
      })
      .catch((error) => {
        console.error("Error uploading resource:", error);
      });
  };

  return { handleSubmit };
};
