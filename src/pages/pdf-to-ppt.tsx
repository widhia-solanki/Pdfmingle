// src/pages/pdf-to-ppt.tsx

import { ToolComingSoon } from "@/components/ToolComingSoon";
import { toolArray } from "@/constants/tools";
import { NextSeo } from "next-seo";

const PdfToPptPage = () => {
    const tool = toolArray.find(t => t.value === 'pdf-to-powerpoint');
    
    if (!tool) return <div>Tool not found</div>;
    
    return (
        <>
            <NextSeo title={tool.metaTitle} description={tool.description} />
            <ToolComingSoon tool={tool} />
        </>
    )
}
export default PdfToPptPage;
