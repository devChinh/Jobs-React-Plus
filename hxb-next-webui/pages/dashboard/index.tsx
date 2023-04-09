import type { NextPage } from "next";
import { GetServerSideProps, GetServerSidePropsResult } from "next";

import { SSRConfig } from "next-i18next";
import { serverSideTranslations } from "next-i18next/serverSideTranslations";

import DashboardContainer from "../../container/Dashboard";

const Dashboard: NextPage = () => <DashboardContainer />;

export const getServerSideProps: GetServerSideProps = async ({
  locale,
}): Promise<GetServerSidePropsResult<SSRConfig>> => {
  const l = locale ? locale : "";
  return {
    props: {
      ...(await serverSideTranslations(l, ["common", "dashboard"])),
    },
  };
};

export default Dashboard;
