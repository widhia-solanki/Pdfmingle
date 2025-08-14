import { GetStaticPaths, GetStaticProps, NextPage } from 'next';
import Head from 'next/head';
import Link from 'next/link';
import { tools, Tool } from '@/constants/tools';
import { PDFProcessor } from '@/components/PDFProcessor'; // This is your file uploader component
import { ToolPageLayout } from '@/components/ToolPageLayout';

interface ToolPageProps {
  tool: Tool;
}

const ToolPage: NextPage<ToolPageProps> = ({ tool }) => {
  return <ToolPageLayout tool={tool} />;
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

  return { props: { tool } };
};

export default ToolPage;
