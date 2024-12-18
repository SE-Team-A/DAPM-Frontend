/**
 * Author:
 * - Ayat Al Rifai 
 * - Thøger Bang Petersen
 */

import { AppBar, Box, Button, TextField, Toolbar, Typography } from "@mui/material";
import ArrowBackIosNewIcon from '@mui/icons-material/ArrowBackIosNew';
import { useNavigate } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import { getActiveFlowData, getActivePipeline, getPipelines } from "../../redux/selectors";
import { useState } from "react";
import { updatePipelineName } from "../../redux/slices/pipelineSlice";
import EditIcon from '@mui/icons-material/Edit';
import { Node } from "reactflow";
import { DataSinkNodeData, DataSourceNodeData, OperatorNodeData, OrganizationNodeData, PipelineData } from "../../redux/states/pipelineState";
import { editPipeline, putCommandStart, putExecution, putPipeline } from "../../services/backendAPI";
import { getOrganizations, getRepositories } from "../../redux/selectors/apiSelector";
import { getHandleId, getNodeId } from "./Flow";

export default function PipelineAppBar() {
  const navigate = useNavigate();
  const dispatch = useDispatch();

  const [isEditing, setIsEditing] = useState(false);

  const handleStartEditing = () => {
    setIsEditing(true);
  };

  const handleFinishEditing = () => {
    setIsEditing(false);
  };

  const organizations = useSelector(getOrganizations)
  const repositories = useSelector(getRepositories)

  const pipeline = useSelector(getActivePipeline)
  const pipelineID = useSelector(getActivePipeline)?.id

  const setPipelineName = (name: string) => {
    dispatch(updatePipelineName(name))
  }

  const flowData = useSelector(getActiveFlowData)

  const generateJson = () => {
    var edges = flowData!.edges.map(edge => {
      return { sourceHandle: edge.sourceHandle, targetHandle: edge.targetHandle }
    })

    const dataSinks = flowData?.edges.map((edge) => {
      if (edge.data?.filename) {
        const newTarget = getHandleId()
        const egeToModify = edges.find(e => e.sourceHandle == edge.sourceHandle && e.targetHandle == edge.targetHandle)
        egeToModify!.targetHandle = newTarget

        const originalDataSink = flowData!.nodes.find(node => node.id === edge.target) as Node<DataSinkNodeData>
        return {
          type: originalDataSink?.type,
          data: {
            ...originalDataSink?.data,
            templateData: { sourceHandles: [], targetHandles: [{ id: newTarget }] },
            instantiationData: {
              resource: {
                //...originalDataSink?.data?.instantiationData.repository, 
                organizationId: originalDataSink?.data?.instantiationData.repository?.organizationId,
                repositoryId: originalDataSink?.data?.instantiationData.repository?.id,
                name: edge?.data?.filename
              }
            }
          },
          position: { x: originalDataSink.position.x, y: originalDataSink.position.y },
          id: getNodeId(),
          width: originalDataSink.width,
          height: originalDataSink.height,
        }
      }
    }).filter(node => node !== undefined) as any

    const pipelineJson = {
      name: pipeline?.name ?? "",
      pipeline: {
        nodes: flowData?.nodes?.filter(node => node.type === 'dataSource').map(node => node as Node<DataSourceNodeData>).map(node => {
          return {
            type: node.type,
            data: {
              ...node.data,
              instantiationData: {
                resource: {
                  //...node?.data?.instantiationData.resource,
                  organizationId: node?.data?.instantiationData.resource?.organizationId,
                  repositoryId: node?.data?.instantiationData.resource?.repositoryId,
                  resourceId: node?.data?.instantiationData.resource?.id,
                },
              }
            },
            width: node.width, height: node.height, position: { x: node.position.x, y: node.position.y }, id: node.id, label: "",
          } as any
        }).concat(
          flowData?.nodes?.filter(node => node.type === 'operator').map(node => node as Node<OperatorNodeData>).map(node => {
            return {
              type: node.type, data: {
                ...node.data,
                instantiationData: {
                  resource: {
                    //...node?.data?.instantiationData.algorithm,
                    organizationId: node?.data?.instantiationData.algorithm?.organizationId,
                    repositoryId: node?.data?.instantiationData.algorithm?.repositoryId,
                    resourceId: node?.data?.instantiationData.algorithm?.id,
                  }
                }
              },
              width: node.width, height: node.height, position: { x: node.position.x, y: node.position.y }, id: node.id, label: "",
            } as any
          }).concat(
            flowData?.nodes?.filter(node => node.type === 'organization').map(node => node as Node<OrganizationNodeData>).map(node => {
              return {
                type: node.type, data: {
                  ...node.data,
                  instantiationData: {
                    resource: {},
                    organization: {
                      //...node?.data?.instantiationData.algorithm,
                      name: node?.data?.instantiationData.organization?.name,
                      organizationId: node.data.instantiationData.organization?.id,
                      apiUrl: node?.data?.instantiationData.organization?.apiUrl,
                    }
                  }
                },
                width: node.width, height: node.height, position: { x: node.position.x, y: node.position.y }, id: node.id, label: "",
              } as any
            }))
        )
        .concat(dataSinks),
        edges: edges.map(edge => {
          return { sourceHandle: edge.sourceHandle, targetHandle: edge.targetHandle }
        })
      }
    }

    const selectedOrg = organizations[0]
    const selectedRepo = repositories.filter(repo => repo.organizationId === selectedOrg.id)[0]

    return {
      org: selectedOrg,
      repo: selectedRepo,
      pipeline: pipelineJson
    };
  }

  const savePipeline = async () => {
    const {org, repo, pipeline} = generateJson();

    if (pipelineID?.startsWith('pipeline')){
      const pipelineId = await putPipeline(org.id, repo.id, pipeline);    
      console.log(`Pipeline with id: ${pipelineId} has been saved successfully!`);
      window.location.href=process.env.REACT_APP_FRONTEND_URL+''
      
    }
   else if (pipelineID){
    const pipelineId = await editPipeline(org.id, repo.id, pipelineID, pipeline);    
    console.log(`Pipeline with id: ${pipelineID} has been edited successfully!`);
   }
  };

  const gotoExecutions = () => navigate(`/executions/${organizations[0].id}/${pipeline?.repositoryId}/${pipeline?.id}`);

  const deployPipeline = async () => {
    const {org, repo, pipeline} = generateJson();

    // /// TODO: don't save it twice
    // const pipelineId = await putPipeline(org.id, repo.id, pipeline)
    // const executionId = await putExecution(org.id, repo.id, pipelineId)
    // await putCommandStart(org.id, repo.id, pipelineId, executionId)
  };

  return (
    <AppBar position="fixed">
      <Toolbar sx={{ flexGrow: 1 }}>
        <Button onClick={() => navigate('/')}>
          <ArrowBackIosNewIcon sx={{ color: "white" }} />
        </Button>
        <Box sx={{ width: '100%', textAlign: 'center' }}>
          {isEditing ? (
            <TextField
              value={pipeline?.name}
              onChange={(event) => setPipelineName(event?.target.value as string)}
              autoFocus
              onBlur={handleFinishEditing}
              inputProps={{ style: { textAlign: 'center', width: 'auto' } }}
            />
          ) : (
            <Box onClick={handleStartEditing} sx={{ display: 'flex', flexDirection: 'row', justifyContent: 'center', width: '100%' }}>
              <Typography>{pipeline?.name}</Typography>
              <EditIcon sx={{ paddingLeft: '10px' }} />
            </Box>
          )}
        </Box>
        <Button onClick={() => savePipeline()}>
          <Typography variant="body1" sx={{ color: "white" }}>Save pipeline</Typography>
        </Button>
        <Button onClick={() => gotoExecutions()}>
          <Typography variant="body1" sx={{ color: "white" }}>See Executions</Typography>
        </Button>
        <Button onClick={() => deployPipeline()}>
          <Typography variant="body1" sx={{ color: "white" }}>Deploy pipeline</Typography>
        </Button>
      </Toolbar>
    </AppBar>
  )
}

