import { createRoot } from "react-dom/client";
import { styled } from "@mui/material/styles";
import Box from "@mui/material/Box";
import Paper from "@mui/material/Paper";
import Grid from "@mui/material/Grid";
import PipelineCard from "./PipelineCard";
import { Button } from "@mui/material";
import AddIcon from "@mui/icons-material/Add";
import { useNavigate } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import {
  addNewPipeline,
  setMultipleImageData,
  setPipelines,
} from "../../redux/slices/pipelineSlice";
import { getPipelines } from "../../redux/selectors";
import FlowDiagram from "./ImageGeneration/FlowDiagram";
import { toPng } from "html-to-image";
import { getNodesBounds, getViewportForBounds } from "reactflow";
import { v4 as uuidv4 } from "uuid";
import { useEffect } from "react";
import {
  getOrganizations,
  getRepositories,
} from "../../redux/selectors/apiSelector";
import { fetchRepositoryPipelineList } from "../../services/backendAPI";
import { Spinner } from "../common/Spinner";
import { Edge, Node } from "reactflow";
import throttle from "lodash/throttle";
import { Root } from "react-dom/client";

const Item = styled(Paper)(({ theme }) => ({
  backgroundColor: theme.palette.mode === "dark" ? "#1A2027" : "#fff",
  ...theme.typography.body2,
  padding: theme.spacing(1),
  textAlign: "center",
  color: theme.palette.text.secondary,
}));

interface NodeState {
  nodes: Node[];
  edges: Edge[];
}

// Pipeline interface using NodeState
interface Pipeline {
  id: string;
  name: string;
  imgData?: string;
  pipeline: NodeState;
}

interface ImageData {
  id: string;
  imgData: string;
}

export default function AutoGrid() {
  const navigate = useNavigate();
  const dispatch = useDispatch();

  /**
   * Author:
   * - Raihanullah Mehran
   *
   * Description:
   * 1. This part of code calls the fetchRepositoryPipelineList method which returns pipelines.
   * 2. I created setPipelines reducer on the pipelineSlice.ts of redux to hold the fetched pipelines.
   * 3. Updated the rendering code to use createRoot to replace reactDOM.render because it's deprecated.
   */
  const pipelines = useSelector(getPipelines);
  const organizations = useSelector(getOrganizations);
  const repositories = useSelector(getRepositories);

  // const selectedOrg = useMemo(() => organizations[0], [organizations]);
  // const selectedRepo = useMemo(
  //   () =>
  //     repositories.filter((repo) => repo.organizationId === selectedOrg.id)[0],
  //   [repositories, selectedOrg]
  // );

  const fetcDbPipelines = async () => {
    try {
      // if (!selectedRepo) {
      //   console.error("No repository found for the selected organization.");
      //   return;
      // }

      const pipelines = await fetchRepositoryPipelineList(
        "d87bc490-828f-46c8-aa44-ded7729eaa82", // selectedOrg.id,
        "fa6cf45e-b9f5-4dee-82b3-64fc1957a8fe" // selectedRepo.id
      );

      return pipelines || [];
    } catch (error) {
      console.error("Error fetching data:", error);
      return;
    }
  };

  useEffect(() => {
    if (pipelines.length > 0) {
      console.log(pipelines);

      console.log("request cancelled");

      return;
    }
    console.log("current Pipelines:", pipelines);

    const updatePipelines = async () => {
      console.log("fetching request sent!");

      const dbPipelines = await fetcDbPipelines();
      if (
        dbPipelines &&
        JSON.stringify(dbPipelines) !== JSON.stringify(pipelines)
      ) {
        dispatch(setPipelines(dbPipelines));
      }
    };

    updatePipelines();
  }, [useSelector(getPipelines)]);

  const createNewPipeline = () => {
    dispatch(
      addNewPipeline({
        id: `pipeline-${uuidv4()}`,
        flowData: { nodes: [], edges: [] },
      })
    );
    {
      navigate("/pipeline");
    }
  };

  // Helper to retry finding the element with a delay (retry for 500ms with small intervals)
  const waitForElement = async (
    selector: string,
    retries: number = 10,
    interval: number = 50
  ): Promise<HTMLElement | null> => {
    for (let i = 0; i < retries; i++) {
      const element = document.querySelector(selector) as HTMLElement;
      if (element) {
        return element;
      }
      await new Promise((resolve) => setTimeout(resolve, interval)); // Wait a bit before retrying
    }
    return null;
  };

  // Throttled image generator helper function
  const generatePipelineImage = async (
    pipelineId: string,
    flowData: NodeState
  ): Promise<ImageData> => {
    const { nodes, edges } = flowData;

    // Create an off-screen container
    const container = document.createElement("div");
    container.style.position = "absolute";
    container.style.top = "-10000px"; // Hide off-screen
    container.id = pipelineId;

    document.body.appendChild(container);

    // Render the FlowDiagram inside the off-screen container
    const root: Root = createRoot(container);
    root.render(<FlowDiagram nodes={nodes} edges={edges} />);

    return new Promise(async (resolve, reject) => {
      requestAnimationFrame(async () => {
        const width = 800;
        const height = 600;

        const nodesBounds = getNodesBounds(nodes);
        const { x, y, zoom } = getViewportForBounds(
          nodesBounds,
          width,
          height,
          0.5,
          2,
          1
        );

        const validPipelineId = CSS.escape(pipelineId);
        const elementSelector = `#${validPipelineId} .react-flow__viewport`;

        // Wait for the element to be available
        const element = await waitForElement(elementSelector);

        if (element) {
          toPng(element, {
            backgroundColor: "#333",
            width: width,
            height: height,
            style: {
              width: `${width}px`,
              height: `${height}px`,
              transform: `translate(${x}px, ${y}px) scale(${zoom})`,
            },
          })
            .then((dataUrl) => {
              document.body.removeChild(container);
              resolve({ id: pipelineId, imgData: dataUrl });
            })
            .catch((error) => {
              document.body.removeChild(container);
              reject(error);
            });
        } else {
          document.body.removeChild(container);
          reject(new Error(`Element not found for pipeline: ${pipelineId}`));
        }
      });
    });
  };

  // Properly throttling the asynchronous function using lodash throttle
  const throttledGeneratePipelineImage = throttle(
    (pipelineId: string, flowData: NodeState) =>
      generatePipelineImage(pipelineId, flowData),
    200
  );

  // Generate images for all pipelines and dispatch the data at once
  const generateAllPipelineImages = async () => {
    const imageDataArray: ImageData[] = [];

    for (const pipeline of pipelines) {
      const { id, pipeline: flowData } = pipeline;

      try {
        const imgData = await throttledGeneratePipelineImage(id, flowData);
        imageDataArray.push(imgData);
      } catch (error) {
        console.error(`Error generating image for pipeline ${id}:`, error);
      }
    }

    if (imageDataArray.length > 0) {
      dispatch(setMultipleImageData(imageDataArray));
    }
  };

  useEffect(() => {
    if (pipelines.length > 0) {
      generateAllPipelineImages();
    }
  }, [pipelines, dispatch]);

  const handlePipelineDelete = (deletedPipelineId: string) => {
    const updatedPipelines = pipelines.filter(
      (pipeline) => pipeline.id !== deletedPipelineId
    );
    dispatch(setPipelines(updatedPipelines));
  };

  return (
    <>
      <Box sx={{ flexGrow: 1, flexBasis: "100%" }}>
        <Button
          variant="contained"
          startIcon={<AddIcon />}
          onClick={() => createNewPipeline()}
          sx={{
            backgroundColor: "#bbb",
            "&:hover": { backgroundColor: "#eee" },
            marginBlockStart: "10px",
          }}
        >
          Create New
        </Button>

        {pipelines.length ? (
          <div>
            {pipelines ? (
              <Grid
                container
                spacing={{ xs: 1, md: 1 }}
                sx={{ padding: "10px" }}
              >
                {pipelines.map(({ id, name, imgData }) => (
                  <Grid item xs={12} sm={6} md={4} lg={3} xl={3}>
                    <PipelineCard
                      id={id}
                      name={name}
                      orgId={"id"}
                      repoId={"id"}
                      imgData={imgData}
                      onDelete={handlePipelineDelete}
                    ></PipelineCard>
                  </Grid>
                ))}
              </Grid>
            ) : (
              <div>No pipelines found!</div>
            )}
          </div>
        ) : (
          <div className="flex justify-center item">
            <Spinner />
          </div>
        )}
      </Box>
    </>
  );
}
