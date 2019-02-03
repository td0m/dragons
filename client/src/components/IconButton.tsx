import styled from '@emotion/styled';
import { a } from '../colors';

const IconButton = styled("div")`
  user-select: none;
  display: block;
  height: 22px;
  width: 22px;
  display: flex;
  justify-content: center;
  align-items: center;
  cursor: pointer;
  &, * {
    font-size: 18px;
  }
  transition: all 0.2s ease;
  border-radius: 50%;
  :hover {
    background: rgba(${a.r}, ${a.g}, ${a.b},0.1);
  }
  :active {
    background: rgba(${a.r}, ${a.g}, ${a.b},0.2);
  }
`;
export default IconButton;