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
  setImageData,
  setPipelines,
} from "../../redux/slices/pipelineSlice";
import { getPipelines } from "../../redux/selectors";
import FlowDiagram from "./ImageGeneration/FlowDiagram";
import ReactDOM from "react-dom";
import { toPng } from "html-to-image";
import { getNodesBounds, getViewportForBounds } from "reactflow";
import { v4 as uuidv4 } from "uuid";
import { useEffect, useState } from "react";
import {
  getOrganizations,
  getRepositories,
} from "../../redux/selectors/apiSelector";
import {
  fetchPipeline,
  fetchRepositoryPipelineList,
  fetchRepositoryPipelines,
} from "../../services/backendAPI";
import { toast, ToastContainer } from "react-toastify";
import { Spinner } from "../common/Spinner";

const Item = styled(Paper)(({ theme }) => ({
  backgroundColor: theme.palette.mode === "dark" ? "#1A2027" : "#fff",
  ...theme.typography.body2,
  padding: theme.spacing(1),
  textAlign: "center",
  color: theme.palette.text.secondary,
}));

interface Pipeline {
  id: string;
  name: string;
  organizationId: string;
  repositoryId: string;
  pipeline: any | null;
}

export default function AutoGrid() {
  const navigate = useNavigate();

  const dispatch = useDispatch();

  // START

  const organizations = useSelector(getOrganizations);
  const repositories = useSelector(getRepositories);

  const pipelines = useSelector(getPipelines); // Get pipelines from the Redux store
  console.log("localPipelines:", pipelines);

  const fetcDbPipelines = async () => {
    try {
      const selectedOrg = organizations[0];
      const selectedRepo = repositories.find(
        (repo) => repo.organizationId === selectedOrg.id
      );

      if (!selectedRepo) {
        console.error("No repository found for the selected organization.");
        return [];
      }

      const pipelines = await fetchRepositoryPipelineList(
        selectedOrg.id,
        selectedRepo.id
      );

      return pipelines || [];
    } catch (error) {
      console.error("Error fetching data:", error);
      return [];
    }
  };

  useEffect(() => {
    const updatePipelines = async () => {
      const dbPipelines = await fetcDbPipelines();
      if (dbPipelines) {
        console.log("dbPipelines : ", dbPipelines);
        dispatch(setPipelines(dbPipelines));
      }
    };

    updatePipelines();
  }, [dispatch, organizations, repositories]);

  //END

  // const pipelines = useSelector(getPipelines);
  console.log("PipelineGrid:", pipelines);

  // START
  // const [dbPipelines, setDbPipelines] = useState<any[]>([]);
  // const [loading, setLoading] = useState(true);
  // const [error, setError] = useState<string | null>(null);

  // const organizations = useSelector(getOrganizations);
  // const repositories = useSelector(getRepositories);

  // const selectedOrg = organizations[0];
  // const selectedRepo = repositories.filter(
  //   (repo) => repo.organizationId === selectedOrg.id
  // )[0];

  // console.log("oID", selectedOrg.id);
  // console.log("repID", selectedRepo.id);

  // useEffect(() => {
  //   const fetchData = async () => {
  //     if (selectedOrg && selectedRepo) {
  //       try {
  //         const data = await fetchRepositoryPipelines(
  //           selectedOrg.id,
  //           selectedRepo.id
  //         );
  //         console.log("Fetched Data: ", data);

  //         if (data.result && data.result.pipelines) {
  //           let pipelinesWithDetails = data.result.pipelines;

  //           // Now fetching pipeline resources
  //           const promises = pipelinesWithDetails.map(
  //             async (pipeline: Pipeline) => {
  //               if (pipeline.pipeline === null) {
  //                 const pipelineDetails = await fetchPipeline(
  //                   selectedOrg.id,
  //                   selectedRepo.id,
  //                   pipeline.id
  //                 );
  //                 return {
  //                   ...pipeline,
  //                   pipeline: pipelineDetails.result,
  //                 };
  //               }
  //               return pipeline;
  //             }
  //           );

  //           const resolvedPipelines = await Promise.all(promises);
  //           setDbPipelines(resolvedPipelines);
  //         }
  //       } catch (error) {
  //         console.log("Error fetching pipelines: ", error);
  //       } finally {
  //         setLoading(false);
  //       }
  //     }
  //   };

  //   fetchData();
  // }, [selectedOrg, selectedRepo]);

  // console.log("Fetched Pipelines: ", dbPipelines);

  // END

  // const pipelines: any[] = [];
  // const pipelines = dbPipelines;

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

  pipelines.map(({ pipeline: flowData, id, name }) => {
    const nodes = flowData.nodes;
    const edges = flowData.edges;
    // console.log(name, nodes, edges);
    const pipelineId = id;
    const container = document.createElement("div");
    container.style.position = "absolute";
    container.style.top = "-10000px";
    container.id = pipelineId;
    document.body.appendChild(container);

    ReactDOM.render(
      <FlowDiagram nodes={nodes} edges={edges} />,
      container,
      () => {
        const width = 800;
        const height = 600;

        const nodesBounds = getNodesBounds(nodes!);
        const { x, y, zoom } = getViewportForBounds(
          nodesBounds,
          width,
          height,
          0.5,
          2,
          1
        );

        const validPipelineId = CSS.escape(pipelineId);

        const element = document.querySelector(
          `#${validPipelineId} .react-flow__viewport`
        ) as HTMLElement;

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
          }).then((dataUrl) => {
            dispatch(setImageData({ id: pipelineId, imgData: dataUrl }));
            document.body.removeChild(container);
          });
        } else {
          console.error(`Element not found for pipeline: ${pipelineId}`);
        }
      }
    );
  });

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
                      imgData={imgData}
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
