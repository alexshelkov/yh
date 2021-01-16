import {createSlice, PayloadAction} from '@reduxjs/toolkit';

import {AppThunk} from './store';

type Todo = {
  id: number,
  title: string,
  description: string,
  createdAt: string
  updatedAt: string
}

type Todos = Todo[];

interface TodosState {
  todos: Todos
  isLoading: boolean
  error: string | null
}

const todosInitialState: TodosState = {
  todos: [],
  isLoading: false,
  error: null
};

const getTodos = async (token: string) => {
  const response = await fetch('https://academeez-login-ex.herokuapp.com/api/tasks', {
    headers: {
      'Authorization': `Bearer ${token}`
    }
  });

  return response.json();
};

const startLoading = (state: TodosState) => {
  state.isLoading = true;
};

const loadingFailed = (state: TodosState, action: PayloadAction<string>) => {
  state.isLoading = false;
  state.error = action.payload;
};

const todos = createSlice({
  name: 'todos',
  initialState: todosInitialState,
  reducers: {
    getTodosStart: startLoading,
    getTodosSuccess(state, {payload}: PayloadAction<Todos>) {
      state.isLoading = false;
      state.error = null;
      state.todos = payload;
    },
    getTodosFailure: loadingFailed
  }
});

export const {
  getTodosStart,
  getTodosSuccess,
  getTodosFailure
} = todos.actions;

export default todos.reducer;

export const fetchTodos = (
  token: string
): AppThunk => async dispatch => {
  try {
    dispatch(getTodosStart());
    const todos = await getTodos(token);
    dispatch(getTodosSuccess(todos));
  } catch (err) {
    dispatch(getTodosFailure(err.toString()));
  }
};
