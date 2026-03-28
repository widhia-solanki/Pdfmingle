// src/pages/excel-to-pdf.tsx

import { ToolComingSoon } from "@/components/ToolComingSoon";
import { toolArray } from "@/constants/tools";
import { NextSeo } from "next-seo";

const ExcelToPdfPage = () => {
    const tool = toolArray.find(t => t.value === 'excel-to-pdf');
    
    if (!tool) return <div>Tool not found</div>;

    return (
        <>
            <NextSeo title={tool.metaTitle} description={tool.description} />
            <ToolComingSoon tool={tool} />
        </>
    )
}
export default ExcelToPdfPage;
