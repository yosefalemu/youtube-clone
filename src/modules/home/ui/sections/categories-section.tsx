"use client";
import FilterCarousel from "@/components/filter-carousel";
import { trpc } from "@/trpc/client";
import { Suspense } from "react";
import { ErrorBoundary } from "react-error-boundary";
import { useRouter } from "next/navigation";

interface CategoriesSectionProps {
  categoryId?: string;
}
export default function CategoriesSection({
  categoryId,
}: CategoriesSectionProps) {
  return (
    <Suspense fallback={<CategoriesSectionSkeloton />}>
      <ErrorBoundary fallback={<CategoriesSectionError />}>
        <CategoriesSectionSuspense categoryId={categoryId} />
      </ErrorBoundary>
    </Suspense>
  );
}

const CategoriesSectionSkeloton = () => {
  return (
    <FilterCarousel isLoading data={[]} onSelect={() => {}} value={null} />
  );
};
const CategoriesSectionError = () => {
  return <p>ERROR...</p>;
};
const CategoriesSectionSuspense = ({ categoryId }: CategoriesSectionProps) => {
  const router = useRouter();
  const [categories] = trpc.categories.getMany.useSuspenseQuery();
  const data = categories.map(({ id, name }) => ({ value: id, label: name }));
  const onSelect = (value?: string | null) => {
    const url = new URL(window.location.href);
    if (value) {
      url.searchParams.set("categoryId", value);
    } else {
      url.searchParams.delete("categoryId");
    }
    router.push(url.toString());
  };

  return (
    <div className="w-full">
      <FilterCarousel
        data={data}
        value={categoryId ?? null}
        onSelect={onSelect}
      />
    </div>
  );
};
