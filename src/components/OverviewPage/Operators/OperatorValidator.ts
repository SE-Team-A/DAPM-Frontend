/**
 * Author:
 * - Raihanullah Mehran
 */

export const validateFileExtension = (
  file: File | null,
  allowedExtensions: string[]
): boolean => {
  if (!file) return false;

  if (file.name === "Dockerfile") return true;

  const fileExtension = file.name.split(".").pop()?.toLowerCase();
  return allowedExtensions.includes(fileExtension || "");
};

export const validateFileInputs = (
  sourceCodeFile: File | null,
  dockerfileFile: File | null
): { valid: boolean; errors: string[] } => {
  const errors: string[] = [];

  // Validate source code file
  if (!sourceCodeFile) {
    errors.push("Source code file is required.");
  } else if (!validateFileExtension(sourceCodeFile, ["py"])) {
    errors.push("Source code file must have a .py extension.");
  }

  // Validate Dockerfile
  if (!dockerfileFile) {
    errors.push("Dockerfile is required.");
  } else if (dockerfileFile.name !== "Dockerfile") {
    errors.push(
      "Dockerfile must be named exactly 'Dockerfile' with no extension."
    );
  }

  return { valid: errors.length === 0, errors };
};
