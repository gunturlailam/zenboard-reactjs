import { useState } from "react";
import useLocalStorage from "../hooks/useLocalStorage";
import "../css/TodoList.css";

const TodoList = () => {
  const [todos, setTodos] = useLocalStorage("todos", []);
  const [newTodo, setNewTodo] = useState("");
  const [filter, setFilter] = useState("all");

  const generateId = () => {
    return Date.now() + Math.random().toString(36).substr(2, 9);
  };

  const addTodo = (e) => {
    e.preventDefault();
    if (newTodo.trim()) {
      const todo = {
        id: generateId(),
        text: newTodo.trim(),
        completed: false,
        createdAt: new Date().toISOString(),
        priority: "medium",
      };
      setTodos([todo, ...todos]);
      setNewTodo("");
    }
  };

  const toggleTodo = (id) => {
    setTodos(
      todos.map((todo) =>
        todo.id === id ? { ...todo, completed: !todo.completed } : todo
      )
    );
  };

  const deleteTodo = (id) => {
    setTodos(todos.filter((todo) => todo.id !== id));
  };

  const clearCompleted = () => {
    setTodos(todos.filter((todo) => !todo.completed));
  };

  const filteredTodos = todos.filter((todo) => {
    switch (filter) {
      case "active":
        return !todo.completed;
      case "completed":
        return todo.completed;
      default:
        return true;
    }
  });

  const totalTodos = todos.length;
  const completedTodos = todos.filter((todo) => todo.completed).length;
  const activeTodos = totalTodos - completedTodos;
  const completionRate =
    totalTodos > 0 ? Math.round((completedTodos / totalTodos) * 100) : 0;

  return (
    <div className="todo-container">
      <div className="todo-card">
        <div className="todo-header">
          <div className="header-content">
            <h2>Todo List</h2>
            <div className="todo-stats">
              <div className="stat-item">
                <span className="stat-number">{totalTodos}</span>
                <span className="stat-label">Total</span>
              </div>
              <div className="stat-item">
                <span className="stat-number">{activeTodos}</span>
                <span className="stat-label">Active</span>
              </div>
              <div className="stat-item">
                <span className="stat-number">{completionRate}%</span>
                <span className="stat-label">Done</span>
              </div>
            </div>
          </div>

          <div className="progress-container">
            <div className="progress-bar">
              <div
                className="progress-fill"
                style={{ width: `${completionRate}%` }}
              ></div>
            </div>
            <span className="progress-text">{completionRate}% Complete</span>
          </div>
        </div>

        <form onSubmit={addTodo} className="add-todo-form">
          <div className="input-container">
            <input
              type="text"
              value={newTodo}
              onChange={(e) => setNewTodo(e.target.value)}
              placeholder="Add a new task..."
              className="todo-input"
              maxLength={200}
            />
            <button
              type="submit"
              className="add-btn"
              disabled={!newTodo.trim()}
            >
              <span className="add-icon">+</span>
            </button>
          </div>
        </form>

        <div className="filter-container">
          <div className="filter-buttons">
            {["all", "active", "completed"].map((filterType) => (
              <button
                key={filterType}
                onClick={() => setFilter(filterType)}
                className={`filter-btn ${
                  filter === filterType ? "active" : ""
                }`}
              >
                {filterType.charAt(0).toUpperCase() + filterType.slice(1)}
              </button>
            ))}
          </div>

          <div className="action-buttons">
            {completedTodos > 0 && (
              <button onClick={clearCompleted} className="action-btn clear">
                🗑️ Clear Completed
              </button>
            )}
          </div>
        </div>

        <div className="todo-list">
          {filteredTodos.length === 0 ? (
            <div className="empty-state">
              <div className="empty-icon">📝</div>
              <h3>No tasks {filter !== "all" ? filter : "yet"}</h3>
              <p>
                {filter === "all"
                  ? "Add your first task to get started!"
                  : `No ${filter} tasks found.`}
              </p>
            </div>
          ) : (
            filteredTodos.map((todo) => (
              <div
                key={todo.id}
                className={`todo-item ${todo.completed ? "completed" : ""}`}
              >
                <div className="todo-content">
                  <button
                    onClick={() => toggleTodo(todo.id)}
                    className={`checkbox ${todo.completed ? "checked" : ""}`}
                  >
                    {todo.completed && <span className="checkmark">✓</span>}
                  </button>

                  <div className="todo-text-container">
                    <div className="todo-text">{todo.text}</div>
                    <div className="todo-meta">
                      <span className="todo-date">
                        {new Date(todo.createdAt).toLocaleDateString("id-ID", {
                          day: "numeric",
                          month: "short",
                        })}
                      </span>
                    </div>
                  </div>
                </div>

                <div className="todo-actions">
                  <button
                    onClick={() => deleteTodo(todo.id)}
                    className="delete-btn"
                    title="Delete task"
                  >
                    🗑️
                  </button>
                </div>
              </div>
            ))
          )}
        </div>

        {todos.length > 0 && (
          <div className="todo-footer">
            <div className="footer-stats">
              <span>
                {activeTodos} task{activeTodos !== 1 ? "s" : ""} remaining
              </span>
              {completedTodos > 0 && <span>{completedTodos} completed</span>}
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default TodoList;
