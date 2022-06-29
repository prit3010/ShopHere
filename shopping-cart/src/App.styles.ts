import styled from 'styled-components';
import IconButton from '@mui/material/IconButton';

export const Box = styled.div`
  margin: 20px;

`;

export const StyledButton = styled(IconButton)`
  position: fixed;
  z-index: 100;
  right: 20px;
  top: 20px;
  background-color: blue;
  color: red
`;
