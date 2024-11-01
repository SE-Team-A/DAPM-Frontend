import { useEffect, useCallback } from "react";
import { useDispatch, useSelector } from "react-redux";
import { setPipelines } from "../../../../redux/slices/pipelineSlice";
import { getPipelines } from "../../../../redux/selectors";
import { fetchRepositoryPipelineList } from "../../../../services/backendAPI";

const DEFAULT_ORG_ID = "d87bc490-828f-46c8-aa44-ded7729eaa82";
const DEFAULT_REPO_ID = "fa6cf45e-b9f5-4dee-82b3-64fc1957a8fe";

export const useFetchPipelines = (
  orgId: string = DEFAULT_ORG_ID,
  repoId: string = DEFAULT_REPO_ID
) => {
  const dispatch = useDispatch();
  const pipelines = useSelector(getPipelines);

  // Fetch pipelines from the backend
  const fetchPipelines = useCallback(async () => {
    try {
      const dbPipelines = await fetchRepositoryPipelineList(orgId, repoId);
      if (
        dbPipelines &&
        JSON.stringify(dbPipelines) !== JSON.stringify(pipelines)
      ) {
        dispatch(setPipelines(dbPipelines));
      }
    } catch (error) {
      console.error("Error fetching pipelines:", error);
    }
  }, [dispatch, pipelines, orgId, repoId]);

  // Automatically fetch pipelines on initial render or when orgId/repoId change
  useEffect(() => {
    if (pipelines.length === 0) {
      fetchPipelines();
    }
  }, [pipelines, fetchPipelines]);

  return { pipelines, fetchPipelines };
};
