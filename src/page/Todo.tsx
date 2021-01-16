import React, {useEffect} from 'react';
import {useSelector, useDispatch} from 'react-redux';

import {RootState} from '../reducer';
import {fetchTodos} from '../todoSlice';
import {useToken} from '../Auth';

const TodoPage: React.FunctionComponent = () => {
  const dispatch = useDispatch();
  const {
    todos,
    error,
    isLoading
  } = useSelector((state: RootState) => state.todos);
  const token = useToken();

  useEffect(() => {
    dispatch(fetchTodos(token));
  }, [token]);

  if (isLoading) {
    return (
      <h3>Please wait</h3>
    );
  }

  if (error) {
    return (
      <div>{error}</div>
    );
  }

  return (
    <ul>
      {todos.map(todo => {
        return (
          <li>
            <small>{todo.createdAt}</small>
            <h5>{todo.title}</h5>
            <div style={{marginBottom: '20px'}}>{todo.description}</div>
          </li>
        );
      })}
    </ul>
  );
};

export default TodoPage;
