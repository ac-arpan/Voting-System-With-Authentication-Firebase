const requestModal = document.querySelector('.new-request')
const requestLink = document.querySelector('.add')
const requestForm = document.querySelector('.new-request form')

// open request modal
requestLink.addEventListener('click', () => {
  requestModal.classList.add('open')
})

// close request modal
requestModal.addEventListener('click', (e) => {
  if (e.target.classList.contains('new-request')) {
    requestModal.classList.remove('open')
  }
})

// Add a new option
requestForm.addEventListener('submit', e => {
  console.log('I ran')
  e.preventDefault()
  const addOption = firebase.functions().httpsCallable('addOption')

  addOption({
    text: requestForm.request.value
  })
    .then( msg => {
      requestForm.reset()
      requestModal.classList.remove('open')
      requestForm.querySelector('.error').innerHTML = ''
      console.log(`success : ${msg.message}`)
    })
    .catch(err => {
      requestForm.querySelector('.error').innerHTML = err.message
      console.log('error')
    })
})

// notification
const notification = document.querySelector('.notification')

const showNotification = message => {
  notification.textContent = message
  notification.classList.add('active')

  setTimeout(() => {
    notification.classList.remove('active')
    notification.textContent = ''
  }, 4000)
}




































// practice  functions

// // Say hello function call
// const button = document.querySelector('.call')
// button.addEventListener('click', () => {
//   //get function ref
//   const sayHello = firebase.functions().httpsCallable('sayHello')
//   sayHello({ name: 'Arpan' }).then(result => {
//     console.log(result.data)
//   }).catch(err => console.log(err))
// })