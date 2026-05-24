import { Suspense } from "react";
import HomePage from "@/components/HomePage";
import HomeSkeleton from "@/components/skeletons/HomeSkeleton";

export default function Page() {
  return (
    <Suspense fallback={<HomeSkeleton />}>
      <HomePage />
    </Suspense>
  );
}
