import { Suspense } from "react";

import HomePage from "@/components/HomePage";

import HomeSkeleton from "@/components/skeletons/HomeSkeleton";

interface PageProps {
  searchParams: Promise<{
    category?: string;
  }>;
}

export default async function Page({ searchParams }: PageProps) {
  return (
    <Suspense fallback={<HomeSkeleton />}>
      <HomePage searchParams={searchParams} />
    </Suspense>
  );
}
