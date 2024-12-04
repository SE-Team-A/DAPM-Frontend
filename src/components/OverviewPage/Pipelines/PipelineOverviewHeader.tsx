/**
 * Author:
 * - Raihanullah Mehran
 *
 * Description:
 *
 */

import React, { useState, useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { getPipelines } from "../../../redux/selectors";
import { setPipelines } from "../../../redux/slices/pipelineSlice";
import { fetchRepositoryPipelineList } from "../../../services/backendAPI";

export const PipelineOverviewHeader = ({
  orgId,
  repoId,
}: {
  orgId: string;
  repoId: string;
}) => {
  const dispatch = useDispatch();
  const allPipelines = useSelector(getPipelines);
  const [searchText, setSearchText] = useState("");
  const [sortCriteria, setSortCriteria] = useState("");

  useEffect(() => {
    const fetchDbPipelines = async () => {
      try {
        if (!repoId) {
          console.error("No repository found for the selected organization.");
          return;
        }

        const pipelines = await fetchRepositoryPipelineList(orgId, repoId);
        return pipelines || [];
      } catch (error) {
        console.error("Error fetching data:", error);
        return [];
      }
    };

    const updatePipelines = async () => {
      console.log("Fetching pipelines from the database...");
      const dbPipelines = await fetchDbPipelines();
      if (
        dbPipelines &&
        JSON.stringify(dbPipelines) !== JSON.stringify(allPipelines)
      ) {
        dispatch(setPipelines(dbPipelines));
      }
    };

    if (searchText === "") {
      updatePipelines();
    }
  }, [searchText === ""]);

  const handleSearchChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const searchValue = event.target.value.toLowerCase();
    setSearchText(searchValue);

    if (searchValue === "") {
      return;
    }

    const filteredPipelines = allPipelines.filter((pipeline) =>
      pipeline.name.toLowerCase().includes(searchValue)
    );
    applySorting(filteredPipelines);
  };

  const handleSortChange = (event: React.ChangeEvent<HTMLSelectElement>) => {
    const sortValue = event.target.value;
    setSortCriteria(sortValue);

    applySorting([...allPipelines]);
  };

  const applySorting = (pipelines: typeof allPipelines) => {
    if (sortCriteria === "name") {
      pipelines.sort((a, b) => a.name.localeCompare(b.name));
    } else if (sortCriteria === "id") {
      pipelines.sort((a, b) => a.id.localeCompare(b.id));
    }
    dispatch(setPipelines(pipelines));
  };

  return (
    <div className="bg-zinc-500 mx-3 p-3">
      <div className="flex justify-between items-center">
        <div>
          <strong>Count of Pipelines:</strong> {allPipelines.length}
        </div>
        <div>
          <input
            type="text"
            placeholder="Search Pipelines"
            value={searchText}
            onChange={handleSearchChange}
            className="border rounded px-2 py-1"
          />
        </div>
        <div>
          <select
            value={sortCriteria}
            onChange={handleSortChange}
            className="border rounded px-2 py-1"
          >
            <option value="">Sort By</option>
            <option value="name">Name</option>
            <option value="id">Pipeline ID</option>
          </select>
        </div>
      </div>
    </div>
  );
};
