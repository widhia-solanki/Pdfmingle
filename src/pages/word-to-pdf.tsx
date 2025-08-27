import { ToolComingSoon } from "@/components/ToolComingSoon";
import { TOOLS } from "@/constants/tools";
import { NextSeo } from "next-seo";

const WordToPdfPage = () => {
    const tool = TOOLS.find(t => t.key === 'word-to-pdf');

    if (!tool) return <div>Tool not found</div>;

    return (
        <>
            <NextSeo title={tool.title} description={tool.description} />
            <ToolComingSoon tool={tool} />
        </>
    )
}
export default WordToPdfPage;
