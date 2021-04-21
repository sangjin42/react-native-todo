import React, { useState } from "react";
import Input from "./components/Input";
import { StatusBar, Dimensions } from "react-native";
import styled, { ThemeProvider } from "styled-components/native";
import { theme } from "./theme";
import { images } from "./images";
import IconButton from "./components/IconButton";
import Task from "./components/Task";
import AsyncStorage from "@react-native-community/async-storage";
import AppLoading from "expo-app-loading";

/* 1. 스타일링 내장컴퍼넌트 */
const Container = styled.SafeAreaView`
  /* 노치디자인 문제 해결하는 세이프에이리어뷰 */
  flex: 1;
  background-color: ${({ theme }) => theme.background};
  align-items: center;
  justify-content: flex-start;
`;

const Title = styled.Text`
  font-size: 40px;
  font-weight: 600;
  color: ${({ theme }) => theme.main};
  align-self: flex-start;
  margin: 0px 20px;
`;

const List = styled.ScrollView`
  flex: 1;
  width: ${({ width }) => width - 40}px;
`;

/* 2. 출력 함수. 화면전반의 레이아웃을 표현. */
export default function App() {
  /* 2-0. 출력함수에서 사용할 1) 변수, 2) 변수+세터함수, 3) 이벤트함수를 설정 */
  const width = Dimensions.get("window").width;

  const [isReady, setIsReady] = useState(false);
  const [newTask, setNewTask] = useState("");
  const [tasks, setTasks] = useState({
    // 1: { id: "1", text: "Hanbit", completed: false },
    // 2: { id: "2", text: "React Native", completed: true },
    // 3: { id: "3", text: "React Native Sample", completed: false },
    // 4: { id: "4", text: "Edit TODO Item", completed: false },
  });

  const _saveTasks = async tasks => {
    /* add, delete, toggle, update에서 값이 바뀌는 곳마다 저장  */
    try {
      await AsyncStorage.setItem("tasks", JSON.stringify(tasks));
      setTasks(tasks);
    } catch (e) {
      console.error(e);
    }
  };

  const _loadTasks = async () => {
    /* 서버에서 데이터를 받고, 이 데이터를 스테이트에 저장 || {}으로 저장 */
    const loadedTasks = await AsyncStorage.getItem("tasks");
    setTasks(JSON.parse(loadedTasks || "{}"));
  };

  const _addTask = () => {
    /* 인풋에 submit시 onSubmitEditing 이벤트 */
    const ID = Date.now().toString();
    const newTaskObject = {
      [ID]: { id: ID, text: newTask, completed: false },
    };
    console.log("추가되는 내용 newTaskObject", newTaskObject);
    alert(`Add: ${newTask}`);
    setNewTask(""); /* 타이핑시 받는 값은 초기화 */
    // setTasks({ ...tasks, ...newTaskObject });
    _saveTasks({ ...tasks, ...newTaskObject });
  };

  const _handleTextChange = text => {
    /* 인풋에 타이핑시 onChangeText 이벤트 */
    console.log("text:", text);
    setNewTask(text);
  };

  const _deleteTask = id => {
    console.log("딜리트 실행", "id:", id);
    /* 개별 Task 컴퍼넌트 행에서 onPressOut 이벤트 */
    const currentTasks = Object.assign({}, tasks);
    /* 1) state에 있는 tasks 값(디비객체)을 currentTasks로 할당하고 */
    delete currentTasks[id];
    /* 2) currentTasks의 디비객체중 id번호에 해당하는 것을 delete 한다. */
    // setTasks(currentTasks);
    _saveTasks(currentTasks);
    /* 3) 삭제하여 수정된 currentTasks의 디비객체를 
    세터함수 setTasks를 실행해 state 값에 저장한다. */
  };

  const _toggleTask = id => {
    console.log("토글실행", "id:", id);
    const currentTasks = Object.assign({}, tasks);
    currentTasks[id]["completed"] = !currentTasks[id]["completed"];
    /* 해당 id의 completed 값이 true면 false, false면 true로 바꾸어준다 */
    console.log(
      "currentTasks[id]['completed']:",
      currentTasks[id]["completed"]
    );
    // setTasks(currentTasks);
    _saveTasks(currentTasks);
  };

  const _updateTask = item => {
    /* 여기서 item은 editedTask */
    console.log("item:", item);
    const currentTasks = Object.assign({}, tasks);
    console.log("currentTasks[item.id] before:", currentTasks[item.id]);
    currentTasks[item.id] = item;
    /* 현재 스테이트값에 있는 전체 객체데이터중 수정된 id 즉 (item.id)에 해당하는 부분을
    item으로 바꾼다. item은 editedTask.
    */
    console.log("currentTasks[item.id] after:", currentTasks[item.id]);
    // setTasks(currentTasks);
    _saveTasks(currentTasks);
  };

  const _onBlur = () => {
    setNewTask("");
    /* _handleTextChange함수에서 일부 타이핑하여 저장된 newTask의 값을 onblur시 초기화시킨다. */
  };

  return isReady ? (
    <ThemeProvider theme={theme}>
      <Container>
        <StatusBar
          barStyle="light-content"
          backgroundColor={theme.background}
        />
        <Title>TODO List</Title>
        <Input
          placeholder="+ Add a Task"
          value={newTask}
          /* 2. 입력된 newTask 스테이트 값이 표시 */
          onChangeText={_handleTextChange}
          /* 1. 입력시 세터함수 setNewTask를 통해 상태변수 newTask로 state 저장 */
          onSubmitEditing={_addTask}
          /* 3. 제출시, 스테이트값을 얼러트하고, 세터함수를 통해 스테이트값 ''로 초기화 */
          onBlur={_onBlur}
        />
        <List width={width}>
          {Object.values(tasks)
            .reverse()
            .map(item => (
              <Task
                key={item.id}
                item={item}
                deleteTask={_deleteTask}
                toggleTask={_toggleTask}
                updateTask={_updateTask}
              />
            ))}
          {/* tasks에 있는 DB를 통해 객체를 인식하고, 
          이를 reverse하여 순서를 바꾸고, 컴퍼넌트에 맵핑하여 뿌린다 */}
        </List>
      </Container>
    </ThemeProvider>
  ) : (
    <AppLoading
      startAsync={_loadTasks}
      /* 로딩동안 서버에서 데이터를 받고, 이 데이터를 스테이트에 저장 */
      onFinish={() => setIsReady(true)}
      /* 로딩이 완료되면 로딩화면을 본화면으로 전환 */
      onError={console.error}
      /* 오류시 함수 */
    />
  );
}
