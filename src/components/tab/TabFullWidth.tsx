import Colors from '@/utils/assets/colors';
import { AppBar, Box, Card, CardContent, Tab, Tabs, useMediaQuery } from '@mui/material';
import { useTheme } from '@mui/material/styles';
import React from 'react'

export type TabFullWidthData = {
  id: number,
  label: string,
  component: React.ReactNode
}

interface TabFullWidthProps {
  data: Array<TabFullWidthData>
}

interface TabPanelProps {
  children?: React.ReactNode;
  dir?: string;
  index: number;
  value: number;
}

const TabPanel = (props: TabPanelProps) => {
  const { children, value, index, ...other } = props;

  return (
    <>
      {value === index ?

        <div hidden={value !== index}>
          <Card sx={{ marginTop: 1 }}>
            <CardContent>
              {children}
            </CardContent>
          </Card>
        </div>
        : ""}
    </>
  )
}

function a11yProps(index: number) {
  return {
    id: `full-width-tab-${index}`,
    'aria-controls': `full-width-tabpanel-${index}`,
  };
}

const TabFullWidth: React.FC<TabFullWidthProps> = (props) => {
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down('md'));
  const [value, setValue] = React.useState(0);

  const handleChange = (event: React.SyntheticEvent, newValue: number) => {
    setValue(newValue);
  };

  return (
    <Box sx={{ bgcolor: 'background.paper' }}>
      <AppBar position="static" sx={{ borderRadius: 1 }}>
        <Tabs
          value={value}
          onChange={handleChange}
          indicatorColor="primary"
          textColor="inherit"
          variant={isMobile ? "scrollable" : "fullWidth"}
          scrollButtons
          allowScrollButtonsMobile
          aria-label="full width tabs example"
          sx={{ backgroundColor: Colors.blue, borderRadius: 1 }}
          TabIndicatorProps={{
            style: {
              backgroundColor: "white"
            }
          }}
        >
          {props.data.length > 0 && props.data.map((item, index) => (
            <Tab sx={{ fontWeight: 'bold' }} label={item.label} key={index} {...a11yProps(item.id)} />
          ))}
        </Tabs>
      </AppBar>

      {props.data.length > 0 && props.data.map((item, index) => (
        <TabPanel value={value} index={index} key={index} dir={theme.direction}>
          {item.component}
        </TabPanel>
      ))}
    </Box>
  );
}

export default TabFullWidth