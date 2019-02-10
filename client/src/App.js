import React, { Component } from 'react';
import './App.css';


import Pusher from 'pusher-js';

const API_URL = 'http://localhost:9000/api/';
const PUSHER_APP_KEY = '0a9b71501c34687037ae';
const PUSHER_APP_CLUSTER = 'us2';

class App extends Component {
  constructor(props) {
    super(props);
    this.state = {
      tasks: [],
      task: ''
    };
    this.updateText = this.updateText.bind(this);
    this.postTask = this.postTask.bind(this);
    this.deleteTask = this.deleteTask.bind(this);
    this.addTask = this.addTask.bind(this);
    this.removeTask = this.removeTask.bind(this);
  }
    
  updateText(e) {
    this.setState({ task: e.target.value });
  }

  postTask(e) {
    e.preventDefault();
    if (!this.state.task.length) {
      return;
    }
    const newTask = {
      task: this.state.task
    };
    fetch(API_URL + 'new', {
      method: 'post',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify(newTask)
    }).then(console.log);
  }
    
  deleteTask(id) {
    console.log(id)
    fetch(API_URL + id, {
      method: 'delete'
    }).then(res => {

        console.log(res)
      })
  }

  addTask(newTask) {
    console.log(this)
    this.setState(prevState => ({
      tasks: prevState.tasks.concat(newTask),
      task: ''
    }));
  }
    
  removeTask(id) {
    // console.log(this.state.tasks)
    // console.log(id)
    // this.setState(prevState => ({
    //   tasks: prevState.tasks.filter(el => el.id !== id)
    // }));
    console.log(this)
    this.loadTasks();
  }

  componentDidMount() {
    this.pusher = new Pusher(PUSHER_APP_KEY, {
	  cluster: PUSHER_APP_CLUSTER,
      encrypted: true,
    });
    this.channel = this.pusher.subscribe('tasks');
	
    this.channel.bind('inserted', this.addTask);
    this.channel.bind('deleted', this.removeTask);
    this.loadTasks();
  }

  loadTasks() {
    console.log(this)
    console.log('trying to load data from db')
    fetch(API_URL+'tasks', {
      method: 'get'
    })
      .then(res =>  res.json())
      .then(
        (res) => {
          console.log(res)
          console.log(this)
          this.setState({tasks: res})
        }
      )
  }

  submitHandler(e) {
    e.preventDefault();
  }

  showState() {
    console.log(this)
  }
    
  render() {

    // let tasks = this.state.tasks.map(item =>
    //   {item.id?
    //     <Task key={item.id} task={item} onTaskClick={this.deleteTask} />:
    //     <Task key={item._id} task={item} onTaskClick={this.deleteTask} />
    //   }
      
    // );

    return (
      <div className="todo-wrapper">
      <button onClick={this.showState}>Show State</button>
        <form onSubmit={this.submitHandler}>
          <input type="text" className="input-todo" placeholder="New task" onChange={this.updateText} value={this.state.task} />
          <div className="btn btn-add" onClick={this.postTask}>+</div>
        </form>
        
        <ul>
          {
            this.state.tasks.map(item =>{
              let id = item.id?item.id:item._id

              return <Task key={id} task={item} onTaskClick={this.deleteTask} />
            })
          }
          {/* {tasks} */}
        </ul>
      </div>
    );
  }
}

class Task extends Component {
  constructor(props) {
    super(props);
    this._onClick = this._onClick.bind(this);
  }
  _onClick() {
    let id = this.props.task.id?this.props.task.id:this.props.task._id
    this.props.onTaskClick(id);
  }
  render() {
    // console.log(this.props.task)
    let id = this.props.task.id?this.props.task.id:this.props.task._id

    return (
      <li key={id} id={id}>
        <div className="text">{this.props.task.task}</div>
        <div className="delete" onClick={this._onClick}>-</div>
      </li>
    );
  }
}

export default App;
