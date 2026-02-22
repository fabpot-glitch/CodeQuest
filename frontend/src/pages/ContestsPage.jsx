import React from "react";
import { Routes, Route, Navigate } from "react-router-dom";

// Contest sub pages
import UpcomingContests from "./UpcomingContests";
import MyContests from "./MyContests";
import ContestDetail from "./ContestDetail";
import ContestRegistration from "./ContestRegistration";
import ContestCategoryDetail from "./ContestCategoryDetail";
import ContestLeaderboard from "./ContestLeaderboard";
import ContestResults from "./ContestResults";

function ContestsPage() {
  return (
    <Routes>
      {/* Default /dashboard/contests */}
      <Route index element={<UpcomingContests />} />

      {/* /dashboard/contests/my */}
      <Route path="my" element={<MyContests />} />

      {/* /dashboard/contests/:contestId */}
      <Route path=":contestId" element={<ContestDetail />} />

      {/* /dashboard/contests/:contestId/register */}
      <Route path=":contestId/register" element={<ContestRegistration />} />

      {/* /dashboard/contests/category/:categoryId */}
      <Route path="category/:categoryId" element={<ContestCategoryDetail />} />

      {/* /dashboard/contests/:contestId/leaderboard */}
      <Route path=":contestId/leaderboard" element={<ContestLeaderboard />} />

      {/* /dashboard/contests/:contestId/results */}
      <Route path=":contestId/results" element={<ContestResults />} />

      {/* fallback */}
      <Route path="*" element={<Navigate to="/dashboard/contests" replace />} />
    </Routes>
  );
}

export default ContestsPage;