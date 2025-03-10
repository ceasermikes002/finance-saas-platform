import { RootPageContent } from "@/components/root-page-content";
import { Suspense } from "react";

export default function DashBoardPage() {

  return (
    <Suspense fallback={<div>Loading...</div>}>
    <RootPageContent/>
  </Suspense>
  );
}