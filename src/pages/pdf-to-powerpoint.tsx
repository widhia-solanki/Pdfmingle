// src/pages/pdf-to-powerpoint.tsx

import { ToolComingSoon } from "@/components/ToolComingSoon";
import { toolArray } from "@/constants/tools";
import { NextSeo } from "next-seo";
import { buildCanonical } from "@/lib/seo";

const PdfToPowerpointPage = () => {
    const tool = toolArray.find(t => t.value === 'pdf-to-powerpoint');
    
    if (!tool) {
        return <div>Error: Tool configuration for PDF to PowerPoint not found.</div>;
    }
    
    return (
        <>
            <NextSeo
                title={tool.metaTitle}
                description={tool.metaDescription}
                canonical={buildCanonical(`/${tool.value}`)}
            />
            <ToolComingSoon tool={tool} />
        </>
    );
};

export default PdfToPowerpointPage;
