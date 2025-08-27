
// src/pages/pdf-to-excel.tsx

import { ToolComingSoon } from "@/components/ToolComingSoon";
import { toolArray } from "@/constants/tools";
import { NextSeo } from "next-seo";

const PdfToExcelPage = () => {
    const tool = toolArray.find(t => t.value === 'pdf-to-excel');

    if (!tool) return <div>Tool not found</div>;

    return (
        <>
            <NextSeo title={tool.metaTitle} description={tool.description} />
            <ToolComingSoon tool={tool} />
        </>
    )
}
export default PdfToExcelPage;
