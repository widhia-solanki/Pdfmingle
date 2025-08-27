// src/pages/excel-to-pdf.tsx

import { ToolComingSoon } from "@/components/ToolComingSoon";
import { TOOLS } from "@/constants/tools";
import { NextSeo } from "next-seo";

const ExcelToPdfPage = () => {
    // Correctly find the tool from the 'TOOLS' array
    const tool = TOOLS.find(t => t.key === 'excel-to-pdf');
    
    if (!tool) return <div>Tool not found</div>;

    return (
        <>
            <NextSeo title={tool.title} description={tool.description} />
            <ToolComingSoon tool={tool} />
        </>
    )
}
export default ExcelToPdfPage;
