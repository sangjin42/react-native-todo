/* 이미지 종류별로 컴퍼넌트를 만들지 않고 IconButton 컴퍼넌트를 호출할때마다,
원하는 이미지의 종류를 props에 type으로 전달하도록 작성했으며, 
아이콘의 색은 입력되는 텍스트와 동일한 색을 사용하도록 스타일을 적용
 */
import React from "react";
import { TouchableOpacity } from "react-native";
import styled from "styled-components/native";
import PropTypes from "prop-types";
import { images } from "../images";

/* 1. 스타일링 내장컴퍼넌트 */
const Icon = styled.Image`
  tint-color: ${({ theme, completed }) =>
    completed ? theme.done : theme.text};
  /* 안드로이드의 경우 tint-color가 없으면 아이콘이 보이지 않는다. 
  안드로이드의 경우 IOS와 달리 색을 지정해주는 역할을 해주는것 같다  */
  width: 30px;
  height: 30px;
  margin: 10px;
`;

/* 2. 출력 함수. 개별 아이콘 버튼을 표현.( 1)체크박스아웃라인, 2)에디트, 3)딜리트) */
/* props는 인자로 넘긴다 */
const IconButton = ({ type, onPressOut, id, completed }) => {
  const _onPressOut = () => {
    /* 컴퍼넌트 내장함수 */
    onPressOut(id);
    /* id인자와 함께 props를 타고 올라간다 */
  };
  return (
    <TouchableOpacity onPressOut={_onPressOut}>
      <Icon source={type} completed={completed} />
    </TouchableOpacity>
  );
};

IconButton.defaultProps = {
  /* props로 onPressOut이 전달되지 않았을 경우에도 
  문제가 발생하지 않도록 디폴트 값을 지정 */
  /* 이벤트 함수를 props로 줄시 전달이 안될떄가 있는 모양 */
  onPressOut: () => {},
};

/* 3. 각 컴퍼넌트의 props 형식 제한*/
IconButton.propTypes = {
  type: PropTypes.oneOf(Object.values(images)).isRequired,
  onPressOut: PropTypes.func,
  id: PropTypes.string,
  completed: PropTypes.bool,
};

/* 4. 익스포트 */
export default IconButton;
