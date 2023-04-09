import type { NextPage } from "next";
import { GetServerSideProps, GetServerSidePropsResult } from "next";

import { SSRConfig } from "next-i18next";
import { serverSideTranslations } from "next-i18next/serverSideTranslations";
import OrganizationContainer from "../../container/Organization";
import RootOrganization from "../../container/RootOrganization";

const Organization: NextPage = () => {
  return (
    <RootOrganization>
      <OrganizationContainer />
    </RootOrganization>
  );
};

export const getServerSideProps: GetServerSideProps = async ({
  locale,
}): Promise<GetServerSidePropsResult<SSRConfig>> => {
  const l = locale ? locale : "";
  return {
    props: {
      ...(await serverSideTranslations(l, ["common", "organization"])),
    },
  };
};

export default Organization;
