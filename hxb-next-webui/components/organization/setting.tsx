import React, { useEffect, useState } from "react";

import { useMutation } from "@apollo/client";
import { Box, FormLabel, TextField, Toolbar, Typography } from "@mui/material";
import { useTranslation } from "next-i18next";

import * as styles from "../../container/OrganizationDetail/style";
import { ORGANIZATION_UPDATE_MUTATION } from "../../graphql/organization";
import { TOrganization } from "../../recoil/atom/organization/types";
import ButtonConfirm from "../buttonConfirm";

interface SettingProps {
  organization?: TOrganization;
  getDataOrganization: () => Promise<void>;
}

const SettingComponent: React.FC<SettingProps> = ({
  organization,
  getDataOrganization,
}) => {
  const { t } = useTranslation("organization");
  const [updateOrg] = useMutation(ORGANIZATION_UPDATE_MUTATION);
  const [organizationName, setOrganizationName] = useState("");
  const [organizationDesc, setOrganizationDesc] = useState("");
  const [organizationId, setOrganizationId] = useState("");

  useEffect(() => {
    if (organization) {
      setOrganizationName(organization.name);
      setOrganizationDesc(organization.description);
      setOrganizationId(organization.id);
    }
  }, [organization]);

  const handleUpdateOrg = async () => {
    try {
      const { data } = await updateOrg({
        variables: {
          updateOrganizationId: organizationId,
          org: {
            name: organizationName,
            description: organizationDesc,
          },
        },
      });
      getDataOrganization();
    } catch (err) {}
  };

  return (
    <Box sx={{ width: "100%" }}>
      <Toolbar sx={{ borderBottom: "1px solid rgba(81, 81, 81, 1)" }}>
        <Typography sx={{ color: "text.primary" }}>{t("setting")}</Typography>
      </Toolbar>
      <styles.ToolbarCustom>
        <FormLabel
          sx={{
            color: "text.primary",
            width: "180px",
          }}
        >
          {t("organization_name")}
        </FormLabel>
        <TextField
          sx={{
            backgroundColor: "organization.background.default",
            borderRadius: "10px",
            ml: 8,
          }}
          value={organizationName}
          onChange={(e) => setOrganizationName(e.target.value)}
          fullWidth
          size={"small"}
        />
      </styles.ToolbarCustom>
      <styles.ToolbarCustom>
        <FormLabel
          sx={{
            color: "text.primary",
            width: "180px",
          }}
        >
          {t("description")}
        </FormLabel>
        <TextField
          sx={{
            backgroundColor: "organization.background.default",
            borderRadius: "10px",
            ml: 8,
          }}
          value={organizationDesc}
          onChange={(e) => setOrganizationDesc(e.target.value)}
          fullWidth
          size={"small"}
        />
      </styles.ToolbarCustom>
      <ButtonConfirm buttonType="save" buttonClick={() => handleUpdateOrg()} />
    </Box>
  );
};

export default SettingComponent;
