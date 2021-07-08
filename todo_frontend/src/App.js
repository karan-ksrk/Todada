import React, { useState, useEffect } from "react";
import "./App.css";

export default function App() {
  const [todoList, setTodoList] = useState([]);
  const [activeItem, setActiveItem] = useState({
    id: null,
    title: "",
    completed: false,
  });
  const [editing, SetEditing] = useState(false);

  useEffect(() => {
    fetchTask();
  }, []);

  function fetchTask() {
    console.log("fetching...");
    fetch("https://todada.herokuapp.com/api/task-list")
      .then((response) => response.json())
      .then((data) => {
        setTodoList(data);
      });
  }
  function getCookie(name) {
    let cookieValue = null;
    if (document.cookie && document.cookie !== "") {
      const cookies = document.cookie.split(";");
      for (let i = 0; i < cookies.length; i++) {
        const cookie = cookies[i].trim();
        // Does this cookie string begin with the name we want?
        if (cookie.substring(0, name.length + 1) === name + "=") {
          cookieValue = decodeURIComponent(cookie.substring(name.length + 1));
          break;
        }
      }
    }
    return cookieValue;
  }

  function handleChange(e) {
    var value = e.target.value;

    setActiveItem({ ...activeItem, title: value });
  }

  function handleSubmit(e) {
    e.preventDefault();
    console.log("Item: ", activeItem);

    var csrftoken = getCookie("csrftoken");

    var url = "https://todada.herokuapp.com/api/task-create/";

    if (editing == true) {
      url = `https://todada.herokuapp.com/api/task-update/${activeItem.id}`;
      SetEditing(false);
    }
    fetch(url, {
      method: "POST",
      headers: {
        "Content-type": "application/json",
        "X-CSRFToken": csrftoken,
      },
      body: JSON.stringify(activeItem),
    })
      .then((response) => {
        fetchTask();
        setActiveItem({
          id: null,
          title: "",
          completed: false,
        });
      })
      .catch(function (err) {
        console.log("Error:", err);
      });
  }

  function startEdit(task) {
    console.log("Task: ", task);
    setActiveItem(task);
    SetEditing(true);
  }

  function deletItem(task) {
    var csrftoken = getCookie("csrftoken");
    fetch(`https://todada.herokuapp.com/api/task-delete/${task.id}`, {
      method: "DELETE",
      headers: {
        "Content-type": "application/json",
        "X-CSRFToken": csrftoken,
      },
    }).then((response) => {
      fetchTask();
    });
  }

  function strikeUnstrike(task) {
    task.completed = !task.completed;
    var csrftoken = getCookie("csrftoken");
    var url = `https://todada.herokuapp.com/api/task-update/${task.id}`;

    fetch(url, {
      method: "POST",
      headers: {
        "Content-type": "application/json",
        "X-CSRFToken": csrftoken,
      },
      body: JSON.stringify({
        ...task,
        completed: task.completed,
      }),
    }).then((response) => {
      fetchTask();
    });
  }
  var tasks = todoList;
  return (
    <div className="container">
      <div className="task-container">
        <div id="form-wrapper">
          <form onSubmit={handleSubmit} id="form">
            <div className="flex-wrapper">
              <div style={{ flex: 6 }}>
                <input
                  onChange={handleChange}
                  type="text"
                  className="form-control"
                  id="title"
                  name="title"
                  value={activeItem.title}
                  placeholder="Add Task"
                />
              </div>
              <div style={{ flex: 1 }}>
                <input
                  type="submit"
                  id="submit"
                  className="btn btn-warning"
                  name="add"
                />
              </div>
            </div>
          </form>
        </div>
        <div className="list-wrapper">
          {tasks.map(function (task, index) {
            return (
              <div key={index} className="task-wrapper flex-wrapper">
                <div onClick={() => strikeUnstrike(task)} style={{ flex: 7 }}>
                  {task.completed == false ? (
                    <span>{task.title}</span>
                  ) : (
                    <strike>{task.title}</strike>
                  )}
                </div>
                <div style={{ flex: 1 }}>
                  <button
                    onClick={() => startEdit(task)}
                    className="btn btn-sm btn-outline-info"
                  >
                    Edit
                  </button>
                </div>
                <div style={{ flex: 1 }}>
                  <button
                    onClick={() => deletItem(task)}
                    className="btn btn-sm btn-outline-dark delete"
                  >
                    -
                  </button>
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
}
