/**
 * Author:
 * - Raihanullah Mehran s233837
 *
 * Description:
 * Home Page: Consist of Logo and name of the software, and also functions as a go back button
 */

import { useNavigate } from "react-router-dom";
import logo from "../../assets/logo.png";

export const HomePage = () => {
  const navigate = useNavigate();
  const handleNavigateToOverview = () => {
    navigate("/");
  };
  return (
    <div
      className="flex flex-col items-center justify-center space-y-4 mb-3 hover:cursor-pointer"
      onClick={handleNavigateToOverview}
    >
      <div>
        <img src={logo} width={150} alt="DAPM Logo" />
      </div>
      <div>
        <div className="text-lg font-bold">Awesome DAPM</div>
      </div>
    </div>
  );
};
