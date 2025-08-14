import { GetStaticPaths, GetStaticProps, NextPage } from 'next';
import Head from 'next/head';
import Link from 'next/link';
import { tools, Tool } from '@/constants/tools';
import { ToolPageLayout } from '@/components/ToolPageLayout';

interface PageProps {
  tool: Omit<Tool, 'icon'>; // The tool data WITHOUT the icon component
}

const DynamicToolPage: NextPage<PageProps> = ({ tool }) => {
  // Find the full tool object (including the icon) from the original list
  const fullTool = tools.find(t => t.value === tool.value)!;

  return <ToolPageLayout tool={fullTool} />;
};

export const getStaticPaths: GetStaticPaths = async () => {
  const paths = tools.map((tool) => ({
    params: { toolId: tool.value },
  }));
  return { paths, fallback: false };
};

export const getStaticProps: GetStaticProps = async ({ params }) => {
  const tool = tools.find(t => t.value === params?.toolId);
  
  if (!tool) {
    return { notFound: true };
  }

  // --- THIS IS THE FIX ---
  // Create a new object without the 'icon' property before returning
  const { icon, ...serializableTool } = tool;

  return { props: { tool: serializableTool } };
};

export default DynamicToolPage;
