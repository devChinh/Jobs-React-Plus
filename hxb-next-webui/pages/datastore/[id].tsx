import type {
  GetServerSideProps,
  GetServerSidePropsResult,
  NextPage,
} from "next";
import DashboardLayout from "../../container/DashboardLayout";
import { useQuery } from "@apollo/client";
import {
  DataStoreItem,
  getDatastoreItemDetails,
} from "../../recoil/atom/datastore/types";
import { GET_DATASTORE_ITEM } from "../../graphql/datastore";
import { useRouter } from "next/router";
import { SSRConfig } from "next-i18next";
import { serverSideTranslations } from "next-i18next/serverSideTranslations";

const DatastoreId: NextPage = () => {
  const router = useRouter();
  const { data, loading, error } = useQuery<DataStoreItem>(GET_DATASTORE_ITEM, {
    variables: {
      applicationId: router.query.datastoreId,
      // itemId: router.query.datastoreId
    },
  });

  return <DashboardLayout></DashboardLayout>;
};

export const getServerSideProps: GetServerSideProps = async ({
  locale,
}): Promise<GetServerSidePropsResult<SSRConfig>> => {
  const l = locale ? locale : "";
  return {
    props: {
      ...(await serverSideTranslations(l, ["common"])),
    },
  };
};

export default DatastoreId;
