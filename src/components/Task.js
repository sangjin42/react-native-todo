import React, { useState } from "react";
import styled from "styled-components/native";
import PropTypes from "prop-types";
import IconButton from "./IconButton";
import { images } from "../images";
import Input from "./Input";

/* 1. 스타일링 내장컴퍼넌트 */
const Container = styled.View`
  flex-direction: row;
  align-items: center;
  background-color: ${({ theme }) => theme.itemBackground};
  border-radius: 10px;
  padding: 5px;
  margin: 3px 0px;
`;

const Contents = styled.Text`
  flex: 1;
  font-size: 24px;
  color: ${({ theme, completed }) => (completed ? theme.done : theme.text)};
  text-decoration-line: ${({ completed }) =>
    completed ? "line-through" : "none"};
`;

/* 2. 출력 함수. 한줄의 할일 행을 표현. */
const Task = ({ item, deleteTask, toggleTask, updateTask }) => {
  const [isEditing, setIsEditing] = useState(false);
  const [text, setText] = useState(
    item.text
  ); /* 디폴트는 부모로부터 가져온 값 */
  console.log(text);

  const _handleUpdateButtonPress = () => {
    setIsEditing(true);
  };
  const _onSubmitEditing = () => {
    if (isEditing) {
      const editedTask = Object.assign({}, item, { text });
      /* 특정 id의 데이터 item객체내부 text값 부분을 
      현재 state에 새롭게 저장된 text값으로 바꾼다 (세터함수 setText에서 바꾼것) */
      /* item은 App.js의 스테이트에 있는 tasks 데이터를 맵핑해서 뿌려준것. 여기서는 인자를 타고 내려온다. */
      setIsEditing(false);
      updateTask(editedTask);
      /* updateTask함수는 const Task=()인자에 updateTask라는 props를 거쳐 함수와 연결되는 것이다.*/
    }
  };

  const _onBlur = () => {
    if (isEditing) {
      setIsEditing(false); /* 에디트모드 초기화 */
      setText(item.text);
      /* 해당 컴퍼넌트 데이터 text값을 디폴트를 부모로부터 가져온 값으로 초기화 */
    }
  };

  return isEditing ? (
    <Input
      value={text}
      onChangeText={text => setText(text)}
      onSubmitEditing={_onSubmitEditing}
      onBlur={_onBlur}
    />
  ) : (
    <Container>
      <IconButton
        type={item.completed ? images.completed : images.uncompleted}
        id={item.id}
        onPressOut={toggleTask}
        completed={item.completed}
      />
      <Contents completed={item.completed}>{item.text}</Contents>
      {item.completed || (
        <IconButton
          type={images.update}
          onPressOut={_handleUpdateButtonPress}
        />
      )}
      <IconButton
        type={images.delete}
        id={item.id}
        onPressOut={deleteTask}
        completed={item.completed}
      />
    </Container>
  );
};

Task.propTypes = {
  item: PropTypes.object.isRequired,
  deleteTask: PropTypes.func.isRequired,
  toggleTask: PropTypes.func.isRequired,
  updateTask: PropTypes.func.isRequired,
};

export default Task;
