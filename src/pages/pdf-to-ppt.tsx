// src/pages/pdf-to-powerpoint.tsx

import { ToolComingSoon } from "@/components/ToolComingSoon";
import { TOOLS } from "@/constants/tools";
import { NextSeo } from "next-seo";

const PdfToPowerpointPage = () => {
    const tool = TOOLS.find(t => t.key === 'pdf-to-powerpoint');
    
    if (!tool) return <div>Tool not found</div>;
    
    return (
        <>
            <NextSeo 
                title={`${tool.title} - Free Online Tool | PDFMingle`}
                description={tool.description} 
            />
            <ToolComingSoon tool={tool} />
        </>
    )
}

export default PdfToPowerpointPage;
