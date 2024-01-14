import { Box, Paper } from "@mui/material";

type Props = {
  title: string;
  children: React.ReactNode;
  paperProps?: any;
  boxProps?: any;
}

export const Panel = ({ title, children, paperProps, boxProps }: Props) => {
  return (
    <Paper sx={{ p: 2, height: '100%', ...paperProps }}>
      <h2 style={{ margin: '10px' }}>{title}</h2>
      <Box sx={{ display: 'flex', flexDirection: 'column', alignItems: 'center', ...boxProps }}>
        {children}
      </Box>
    </Paper>
  )
}