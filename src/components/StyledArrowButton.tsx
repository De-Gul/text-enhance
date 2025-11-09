import { IconButton, styled } from "@mui/material";

const StyledIconButton = styled(IconButton)({
  padding: 0,
  minWidth: 0,
  width: 20,
  height: 20,
  fontSize: 12,
  border: "1px solid #e0e0e0",
  "& svg": {
    fontSize: 12,
    margin: 0,
  },
  "&:hover": {
    backgroundColor: "rgba(0, 0, 0, 0.04)",
  },
  "&:disabled": {
    opacity: 0.5,
    cursor: "not-allowed",
  },
});

export default StyledIconButton;