/**
 * Author:
 * - Raihanullah Mehran
 *
 * Description: A topbar which displays the username, role and also how much time does he/she left before it's token get expired
 */
import React, { useState, useEffect } from "react";
import { jwtDecode, JwtPayload } from "jwt-decode";
import user_sample from "../../assets/user_sample.png";

interface DecodedToken extends JwtPayload {
  sub?: string;
  jti?: string;
  unique_name: string;
  isAdmin?: string;
  role: string;
  exp: number;
}

export const TopBar: React.FC = () => {
  const [userInfo, setUserInfo] = useState<DecodedToken | null>(null);
  const [timeLeft, setTimeLeft] = useState<number | null>(null);

  useEffect(() => {
    const token = localStorage.getItem("token");
    if (token) {
      try {
        const decodedToken = jwtDecode<DecodedToken>(token);
        setUserInfo(decodedToken);

        if (decodedToken.exp) {
          const expiryTime = decodedToken.exp * 1000;
          const currentTime = Date.now();
          const initialTimeLeft = Math.max(
            (expiryTime - currentTime) / 1000,
            0
          );
          setTimeLeft(initialTimeLeft);

          const intervalId = setInterval(() => {
            setTimeLeft((prev) => (prev && prev > 1 ? prev - 1 : 0));
          }, 1000);

          return () => clearInterval(intervalId);
        }
      } catch (error) {
        console.error("Invalid token or decoding error:", error);
      } finally {
      }
    }
  }, []);

  return (
    <div className="flex items-center justify-between px-4 py-2 mx-3 animated-gradient text-white">
      {userInfo && (
        <>
          <div className="flex items-center gap-3">
            <img
              src={user_sample}
              alt="User"
              className="w-10 h-10 rounded-full"
            />
            <div>
              <h2 className="text-lg font-semibold">
                {userInfo.unique_name || "No Name Available"}
              </h2>
              <p className="text-sm">Role: {userInfo.role}</p>
            </div>
          </div>

          {timeLeft !== null && (
            <div
              className={`text-lg ${
                timeLeft <= 60 ? "text-red-500 text-lg" : "text-white"
              }`}
            >
              Time left: {Math.floor(timeLeft / 60)}m{" "}
              {Math.floor(timeLeft % 60)}s
            </div>
          )}
        </>
      )}
      {!userInfo && <div>Loading user information...</div>}
    </div>
  );
};
