import React from "react";
import styled from "styled-components/native";
import { Dimensions } from "react-native";
/* 1) 창크기 재는 디멘젼 임포트 */
import { useWindowDimensions } from "react-native";
import PropTypes from "prop-types";

const StyledInput = styled.TextInput.attrs(({ theme }) => ({
  placeholderTextColor: theme.main,
  /* 부모 위의 theme을 스컴에 내려 적용시키기 위해 .attrs(({theme})=>({})) 를 붙인다 */
}))`
  /* 1. 내장함수 스타일링 */
  width: ${({ width }) => width - 40}px;
  /* 4) 스컴내부에 프로퍼티를 어트리뷰트와 연계 */
  height: 60px;
  margin: 3px 0;
  padding: 15px 20px;
  border-radius: 10px;
  background-color: ${({ theme }) => theme.itemBackground};
  font-size: 25px;
  color: ${({ theme }) => theme.text};
`;

const Input = ({
  placeholder,
  value,
  onChangeText,
  onSubmitEditing,
  onBlur,
}) => {
  /* props로 받아온 placeholder 인자는 객체로 담아야 한다. 왜인지는 모르겠다.. */
  const width = Dimensions.get("window").width;
  // const width = useWindowDimensions().width;
  /* 2) 출력함수에서 창크기 구하는 변수 선언 */
  return (
    <StyledInput
      width={width}
      placeholder={placeholder}
      maxLength={50}
      autoCapitalize="none"
      autoCorrect={false}
      returnKeyType="done"
      keyboardAppearance="dark"
      /* 아이폰 자판을 어둡게 변경 */
      value={value}
      /* 스테이트값 프롭스 연결 */
      onChangeText={onChangeText}
      onSubmitEditing={onSubmitEditing}
      onBlur={onBlur}
      /* 함수 프롭스 연결 */
    />
  );
  /* 2. 함수로 스타일링된 내장함수를 리턴. */
  /* 3) 스컴의 어트리뷰트로 넣어줌 */
};

Input.propTypes = {
  placeholder: PropTypes.string,
  value: PropTypes.string.isRequired,
  onChangeText: PropTypes.func.isRequired,
  onSubmitEditing: PropTypes.func.isRequired,
  onBlur: PropTypes.func.isRequired,
  /* 입력 타입 한정시키기 */
};

export default Input;
/* 3. 익스포트 */
