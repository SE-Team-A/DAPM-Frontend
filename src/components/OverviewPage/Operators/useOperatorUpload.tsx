/**
 * Author:
 * - Raihanullah Mehran
 */
import { useState } from "react";
import { validateFileExtension } from "./OperatorValidator";

export const useOperatorUpload = () => {
  const [selectedSourceFile, setSelectedSourceFile] = useState<File | null>(
    null
  );
  const [selectedDockerFile, setSelectedDockerFile] = useState<File | null>(
    null
  );
  const [fileError, setFileError] = useState<string | null>(null);

  const handleFileChange = (
    event: React.ChangeEvent<HTMLInputElement>,
    type: "source" | "docker"
  ) => {
    setFileError(null);
    if (event.target.files && event.target.files.length > 0) {
      const file = event.target.files[0];

      if (type === "source" && validateFileExtension(file, ["py"])) {
        setSelectedSourceFile(file);
      } else if (type === "docker" && file.name === "Dockerfile") {
        setSelectedDockerFile(file);
      } else {
        setFileError(
          type === "source"
            ? "Invalid file type. Only .py files are allowed for the source code."
            : "Invalid file type. Dockerfile must be named exactly 'Dockerfile' with no extension."
        );
        if (type === "source") setSelectedSourceFile(null);
        if (type === "docker") setSelectedDockerFile(null);
      }
    }
  };

  const handleFileRemove = (type: "source" | "docker") => {
    if (type === "source") setSelectedSourceFile(null);
    if (type === "docker") setSelectedDockerFile(null);
    setFileError(null);
  };

  const resetFileStates = () => {
    setSelectedSourceFile(null);
    setSelectedDockerFile(null);
    setFileError(null);
  };

  return {
    selectedSourceFile,
    selectedDockerFile,
    fileError,
    handleFileChange,
    handleFileRemove,
    resetFileStates,
  };
};
