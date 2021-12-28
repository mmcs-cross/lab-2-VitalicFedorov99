localStorage.clear()

const noTasks = document.querySelector('.whatsUp')
const todoTasks = document.querySelector('.tasks')
const allDone = document.querySelector('.allDone')
const gaugeCircle = document.querySelector('.gauge')
const $gauge = document.querySelector('.gauge')
const addItem = document.querySelector('.add__btn')
const taskCounter = document.querySelector('.counter')

let tasks = JSON.parse(localStorage.getItem('tasks')) || []

const state = getStoredStateOrDefault({
  counter: 40,
})

function TaskId() {
  if (tasks.length) {
    return tasks[tasks.length - 1].id + 1
  }

  return 1
}

function addTask__btn(event) {
  event.preventDefault()
  const value = addItem.value
  addItem.value = ''
  const newTask = {
    id: TaskId(),
    value,
    checked: false,
  }
  tasks.push(newTask)
  taskProcessing()
  saveTasks(tasks)
}

function taskRemove(id) {
  tasks = tasks.filter((elem) => elem.id != id)
  taskProcessing()
  saveTasks(tasks)
}

function taskProcessing() {
  if (tasks.length) {
    const allTasksDone = tasks.every((task) => task.checked)
    if (allTasksDone) {
      noTasks.style.display = 'none'
      todoTasks.style.display = 'none'
      gaugeCircle.style.display = 'none'
      allDone.style.display = 'block'
      taskCounter.style.display = 'none'
    } else {
      noTasks.style.display = 'none'
      todoTasks.style.display = 'block'
      gaugeCircle.style.display = 'block'
      allDone.style.display = 'none'
      taskCounter.style.display = 'flex'
      templateTasks()
      taskToDoCounter()
    }
  } else {
    noTasks.style.display = 'block'
    todoTasks.style.display = 'none'
    gaugeCircle.style.display = 'none'
    allDone.style.display = 'none'
    taskCounter.style.display = 'none'
  }
}

function templateTasks() {
  if (tasks.length) {
    todoTasks.innerHTML = ''
    tasks.forEach((task, index) => {
      let value = task.value
      const newItem = document.createElement('div')
      newItem.classList.add('task__item')
      newItem.innerHTML = `
        <input type="checkbox" ${
          task.checked ? 'checked="checked"' : ''
        } class="custom-checkbox" id="check${index}" name="check" value="yes" onchange="itemChecked(${
        task.id
      }, event.target.checked)">
        <label for="check${index}">${value}</label>
        <div class="remove__button" onclick="taskRemove(${task.id})"></div>
        `
      todoTasks.appendChild(newItem)
    })
  }
  progressCounter()
}

function progressCounter() {
  let percent
  if (tasks.length) {
    const completedTasksCount = tasks.filter((task) => task.checked).length
    percent = Math.round((completedTasksCount / tasks.length) * 100)
  } else {
    percent = 0
  }
  saveState(state)
  setGaugePercent($gauge, percent)
}

function itemChecked(id, checked) {
  const index = tasks.findIndex((task) => task.id === id)
  tasks[index].checked = checked
  taskProcessing()
  saveTasks(tasks)
}

function taskToDoCounter() {
  const activeTasksCount = tasks.filter((task) => task.checked == false).length
  taskCounter.innerHTML = ` ${activeTasksCount} tasks to do`
}

taskProcessing()
