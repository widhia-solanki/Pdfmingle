// src/pages/powerpoint-to-pdf.tsx

import { ToolComingSoon } from "@/components/ToolComingSoon";
import { toolArray } from "@/constants/tools";
import { NextSeo } from "next-seo";

const PowerpointToPdfPage = () => {
    const tool = toolArray.find(t => t.value === 'powerpoint-to-pdf');

    if (!tool) {
        return <div>Error: Tool configuration for PowerPoint to PDF not found.</div>;
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

export default PowerpointToPdfPage;
