// src/pages/ppt-to-pdf.tsx

import { ToolComingSoon } from "@/components/ToolComingSoon";
import { toolArray } from "@/constants/tools";
import { NextSeo } from "next-seo";

const PptToPdfPage = () => {
    const tool = toolArray.find(t => t.value === 'powerpoint-to-pdf');

    if (!tool) return <div>Tool not found</div>;

    return (
        <>
            <NextSeo title={tool.metaTitle} description={tool.description} />
            <ToolComingSoon tool={tool} />
        </>
    )
}
export default PptToPdfPage;
