import { Box, TableBody } from "@mui/material"
import { ReactNode } from "react"

interface Props {
  children?:ReactNode
}

const ScrollTable = ({children}:Props) => {
    return (
      <Box sx={{
        maxHeight:"500px",
        overflowY:"auto",
        position:"relative",
      }}>
        {children}
      </Box>
    )
}   

export default ScrollTable