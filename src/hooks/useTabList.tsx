import TabList from "@mui/lab/TabList";
import { Tab } from "@mui/material";
import { SyntheticEvent, useState } from "react";
import TabContext from "@mui/lab/TabContext";
import TabPanel from "@mui/lab/TabPanel";

interface Tab {
  value: string;
  label: string;
}

interface Props {
  tabs: Tab[];
}

const useTabList = ({ tabs }: Props) => {
  const [value, setValue] = useState<string>(tabs[0].value);
  const handleTabsChange = (event: SyntheticEvent, newValue: string) => {
    setValue(newValue);
  };

  const handleUpdateTab = (newValue: string) => {
    setValue(newValue);
  };

  const _TabList = () => (
    <TabList
      variant="scrollable"
      scrollButtons={false}
      onChange={handleTabsChange}
      sx={{ borderBottom: (theme) => `1px solid ${theme.palette.divider}` }}
    >
      {tabs.map((_tab, index) => (
        <Tab key={index} value={_tab.value} label={_tab.label} />
      ))}
    </TabList>
  );

  return {
    tabValue: value,
    TabList: _TabList,
    TabContext: TabContext,
    TabPanel: TabPanel,
    handleUpdateTab,
  };
};

export default useTabList;
