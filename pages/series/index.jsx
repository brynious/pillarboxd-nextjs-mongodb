import { AllSeries } from '@/page-components/AllSeries';
import Head from 'next/head';

export default function SeriesPage() {
  return (
    <>
      <Head>
        <title>Series • Pillarboxd</title>
      </Head>
      <AllSeries />
    </>
  );
}
