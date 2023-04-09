import type { GetServerSideProps, NextPage } from "next";
import { serverSideTranslations } from "next-i18next/serverSideTranslations";
import ApiAccessLogContainer from "../../container/ApiAccessLog";

const Log: NextPage = () => {
  return <ApiAccessLogContainer />;
};

export const getServerSideProps: GetServerSideProps = async ({
  locale,
  req,
  res,
  ...props
}) => {
  const l = locale ? locale : "";
  return {
    props: {
      ...(await serverSideTranslations(l, ["common", "log"])),
    },
  };
};

export default Log;
