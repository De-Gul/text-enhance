import { Button, styled } from "@mui/material";

export const StyledButton = styled(Button)({
  textTransform: "none",
  boxShadow: "none",
  lineHeight: 1.2,
  "& .MuiChip-root": {
    marginLeft: "0.3em",
  },
});

export default StyledButton;