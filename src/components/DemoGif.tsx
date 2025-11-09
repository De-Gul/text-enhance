import styled from "@emotion/styled";

const StyledContainer = styled("div")({
  display: "flex",
  justifyContent: "center",
  alignItems: "center",
  width: "100%",
  background: " #f0f0f0",
  padding: "2rem",
  borderRadius: "0.3rem",
  margin: "1rem 0",
  fontSize: "0.8rem",
  height: "200px",
});

const DemoGif = () => {
  return (
    <StyledContainer>
      {/* <img src="/demo.gif" alt="Demo" /> */}
      Demo GIF here
    </StyledContainer>
  );
};

export default DemoGif;