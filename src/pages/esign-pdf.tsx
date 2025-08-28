// src/pages/esign-pdf.tsx

import { ToolComingSoon } from "@/components/ToolComingSoon";
import { toolArray } from "@/constants/tools";
import { NextSeo } from "next-seo";

const ESignPdfPage = () => {
    const tool = toolArray.find(t => t.value === 'esign-pdf');
    
    if (!tool) {
        return <div>Error: Tool configuration for eSign PDF not found.</div>;
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

export default ESignPdfPage;
