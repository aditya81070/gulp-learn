const myForm = document.querySelector('form')
myForm.addEventListener('submit', e => {
  e.preventDefault()
  const newItem = document.querySelector('#newItem')
  const learningList = document.querySelector('.learning-list')
  const li = document.createElement('li')
  li.textContent = newItem.value
  learningList.appendChild(li)
  newItem.value = ''
})
