import { Box } from "@mui/material";
import OrganizationSidebar from "../components/OverviewPage/OrganizationSidebar";
import PipelineGrid from "../components/OverviewPage/PipelineGrid";
import { TopBar } from "../components/OverviewPage/TopBar";

export default function UserPage() {
  return (
    <Box sx={{ display: "flex", height: "100vh" }}>
      <Box sx={{ width: "250px" }}>
        <OrganizationSidebar />
      </Box>
      <Box sx={{ flex: 1, display: "flex", flexDirection: "column" }}>
        <TopBar />
        <Box sx={{ flex: 1, overflow: "auto" }}>
          <PipelineGrid />
        </Box>
      </Box>
    </Box>
  );
}
