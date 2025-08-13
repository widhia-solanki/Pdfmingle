import { GetStaticProps, NextPage } from 'next';
import { tools, Tool } from '@/constants/tools';
import { ToolPageLayout } from '@/components/ToolPageLayout';

interface PageProps { tool: Tool }

const MergePdfPage: NextPage<PageProps> = ({ tool }) => {
  return <ToolPageLayout tool={tool} />;
};

export const getStaticProps: GetStaticProps = async () => {
  const tool = tools.find(t => t.value === 'merge-pdf');
  return { props: { tool } };
};

export default MergePdfPage;
