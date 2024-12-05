/**
 * Author:
 * - Raihanullah Mehran
 */
import { useState } from "react";
import { toast } from "react-hot-toast";
import { putResource } from "../../../services/backendAPI";
import { useAppDispatch } from "../../../hooks";
import { resourceThunk } from "../../../redux/slices/apiSlice";
import {
  getOrganizations,
  getRepositories,
} from "../../../redux/selectors/apiSelector";
import { useSelector } from "react-redux";

export const useResourceUpload = (
  orgId: string,
  repId: string,
  closeModal: () => void
) => {
  const dispatch = useAppDispatch();
  const [selectedFileName, setSelectedFileName] =
    useState<string>("No file chosen");
  const [fileError, setFileError] = useState<string | null>(null);

  const organizations = useSelector(getOrganizations);
  const repositories = useSelector(getRepositories);

  const handleFileChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    setFileError(null);
    if (event.target.files && event.target.files.length > 0) {
      const file = event.target.files[0];
      const allowedExtensions = [".txt", ".csv", ".xml", ".xes"];
      const fileExtension = file.name
        .slice(file.name.lastIndexOf("."))
        .toLowerCase();

      if (allowedExtensions.includes(fileExtension)) {
        setSelectedFileName(file.name);
      } else {
        setFileError(
          "Invalid file type. Only .txt, .csv, .xml and .xes files are allowed."
        );
        setSelectedFileName("No file chosen");
        (document.getElementById("upload-file") as HTMLInputElement).value = "";
      }
    } else {
      setSelectedFileName("No file chosen");
    }
  };

  const handleFileRemove = () => {
    setSelectedFileName("No file chosen");
    setFileError(null);
    (document.getElementById("upload-file") as HTMLInputElement).value = "";
  };

  const handleSubmit = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    const formData = new FormData(event.currentTarget);
    if (formData.get("ResourceFile")) {
      toast
        .promise(putResource(orgId, repId, formData), {
          loading: "Uploading...",
          success: <b>Resource successfully uploaded!</b>,
          error: <b>Failed to upload resource.</b>,
        })
        .then(() => {
          console.log("Resource successfully uploaded.");
          if (event.currentTarget instanceof HTMLFormElement) {
            event.currentTarget.reset();
          }
          setSelectedFileName("No file chosen");
          closeModal();
          dispatch(resourceThunk({ organizations, repositories }));
        })
        .catch((error) => {
          console.error("Error uploading resource:", error);
        });
    } else {
      toast.error("No file selected.");
    }
  };

  return {
    selectedFileName,
    fileError,
    handleFileChange,
    handleFileRemove,
    handleSubmit,
  };
};
