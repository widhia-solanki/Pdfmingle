// src/pages/word-to-pdf.tsx

import { ToolComingSoon } from "@/components/ToolComingSoon";
import { toolArray } from "@/constants/tools";
import { NextSeo } from "next-seo";

const WordToPdfPage = () => {
    const tool = toolArray.find(t => t.value === 'word-to-pdf');

    if (!tool) return <div>Tool not found</div>;

    return (
        <>
            <NextSeo title={tool.metaTitle} description={tool.description} />
            <ToolComingSoon tool={tool} />
        </>
    )
}
export default WordToPdfPage;
