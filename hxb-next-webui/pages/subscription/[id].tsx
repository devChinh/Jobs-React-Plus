import type { NextPage } from "next";
import { GetServerSideProps, GetServerSidePropsResult } from "next";

import { SSRConfig } from "next-i18next";
import { serverSideTranslations } from "next-i18next/serverSideTranslations";

import SubscriptionDetailContainer from "../../container/SubscriptionDetail";
import SubscriptionPaymentContainer from "../../container/SubscriptionPayment";

const SubscriptionId: NextPage = () => <SubscriptionDetailContainer />;
// <SubscriptionPaymentContainer />;

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

export default SubscriptionId;
