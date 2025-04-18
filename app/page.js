import React from "react";
import Menu from "@/components/Menu";
import Assessments from "@/components/Assessments";

import { getAssessments, getAssessmentCategory } from "@/app/api/assessment";
import Header from "@/components/Header";

export default async function Home() {
  const assessmentsRes = await getAssessments();
  const categoriesRes = await getAssessmentCategory();

  const sortedAssessments = (assessmentsRes.data?.res || []).sort(
    (a, b) =>
      new Date(b.data.createdAt).getTime() -
      new Date(a.data.createdAt).getTime()
  );
  const categories = categoriesRes.data || [];

  return (
    <>
      <div className="fixed w-full top-0 z-10 bg-white">
        <Header />
      </div>
      <div className="flex mt-[63px]">
        <div className="fixed">
          <Menu />
        </div>
        <div className="flex-grow ml-[220px] p-6 pr-11 pl-8">
          <Assessments
            initialAssessments={sortedAssessments}
            initialCategories={categories}
          />
        </div>
      </div>
    </>
  );
}
