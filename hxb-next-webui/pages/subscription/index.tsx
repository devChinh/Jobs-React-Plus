import type { NextPage } from "next";
import { GetServerSideProps, GetServerSidePropsResult } from "next";

import { SSRConfig } from "next-i18next";
import { serverSideTranslations } from "next-i18next/serverSideTranslations";

import RootSubscription from "../../container/RootSubcription";
import SubscriptionContainer from "../../container/Subscription";

const Subscription: NextPage = () => {
  return (
    <RootSubscription>
      <SubscriptionContainer />
    </RootSubscription>
  );
};

export const getServerSideProps: GetServerSideProps = async ({
  locale,
}): Promise<GetServerSidePropsResult<SSRConfig>> => {
  const l = locale ? locale : "";
  return {
    props: {
      ...(await serverSideTranslations(l, ["common", "subscriptions"])),
    },
  };
};

export default Subscription;
