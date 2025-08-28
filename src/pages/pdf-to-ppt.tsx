// src/pages/pdf-to-powerpoint.tsx

import { ToolComingSoon } from "@/components/ToolComingSoon";
import { toolArray } from "@/constants/tools";
import { NextSeo } from "next-seo";

const PdfToPowerpointPage = () => {
    const tool = toolArray.find(t => t.value === 'pdf-to-powerpoint');
    
    if (!tool) {
        // Fallback for safety, though the tool should exist in the constants file
        return <div>Error: Tool configuration for PDF to PowerPoint not found.</div>;
    }
    
    return (
        <>
            <NextSeo
                title={tool.metaTitle}
                description={tool.metaDescription}
                canonical={`https://pdfmingle.com/${tool.value}`}
            />
            <ToolComingSoon tool={tool} />
        </>
    );
};

export default PdfToPowerpointPage;
