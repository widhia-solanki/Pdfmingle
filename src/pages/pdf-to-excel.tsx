// src/pages/pdf-to-excel.tsx

import { ToolComingSoon } from "@/components/ToolComingSoon";
import { TOOLS } from "@/constants/tools";
import { NextSeo } from "next-seo";

const PdfToExcelPage = () => {
    const tool = TOOLS.find(t => t.key === 'pdf-to-excel');

    if (!tool) return <div>Tool not found</div>;

    return (
        <>
            <NextSeo title={tool.title} description={tool.description} />
            <ToolComingSoon tool={tool} />
        </>
    )
}
export default PdfToExcelPage;
